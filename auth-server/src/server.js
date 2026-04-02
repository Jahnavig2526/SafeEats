const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
)

const PORT = Number(process.env.PORT || 4000)
const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 10 * 60 * 1000)
const ALLOW_DEV_OTP_RESPONSE = String(process.env.ALLOW_DEV_OTP_RESPONSE || 'true').toLowerCase() === 'true'
const otpStore = new Map()

const hasSmtpConfig =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getOrCreateOtp(email) {
  const token = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = Date.now() + OTP_TTL_MS
  otpStore.set(email, { token, expiresAt })
  return { token, expiresAt }
}

function purgeExpiredOtps() {
  const now = Date.now()
  for (const [email, record] of otpStore.entries()) {
    if (record.expiresAt < now) {
      otpStore.delete(email)
    }
  }
}

setInterval(purgeExpiredOtps, 60 * 1000)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'safeeats-auth-server' })
})

app.post('/auth/send-otp', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' })
  }

  const { token, expiresAt } = getOrCreateOtp(email)

  if (!hasSmtpConfig) {
    const message = 'SMTP not configured. Running in dev mode and returning OTP in response.'
    const payload = { ok: true, message, expiresAt }

    if (ALLOW_DEV_OTP_RESPONSE) {
      return res.json({ ...payload, devOtp: token })
    }

    return res.status(503).json({ ok: false, message: 'SMTP not configured on auth server.' })
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SafeEats verification code',
      text: `Your SafeEats verification code is ${token}. It expires in 10 minutes.`,
      html: `<h2>SafeEats verification code</h2><p>Your code is: <strong>${token}</strong></p><p>It expires in 10 minutes.</p>`,
    })

    return res.json({ ok: true, message: 'Verification code sent.', expiresAt })
  } catch (error) {
    otpStore.delete(email)
    return res.status(500).json({ ok: false, message: 'Failed to send email.', detail: error.message })
  }
})

app.post('/auth/verify-otp', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const token = String(req.body?.token || '').trim()

  if (!isValidEmail(email) || token.length !== 6) {
    return res.status(400).json({ ok: false, message: 'Invalid email or code format.' })
  }

  const record = otpStore.get(email)
  if (!record) {
    return res.status(400).json({ ok: false, message: 'No code found. Please request a new code.' })
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email)
    return res.status(400).json({ ok: false, message: 'Code expired. Please request a new code.' })
  }

  if (record.token !== token) {
    return res.status(400).json({ ok: false, message: 'Incorrect code.' })
  }

  otpStore.delete(email)
  return res.json({ ok: true, message: 'Email verified.' })
})

app.listen(PORT, () => {
  console.log(`SafeEats auth server running on http://localhost:${PORT}`)
})
