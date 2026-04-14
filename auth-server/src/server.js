const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Database = require('better-sqlite3')
require('dotenv').config()

const app = express()

const PORT = Number(process.env.PORT || 4000)
const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 10 * 60 * 1000)
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m'
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '30d'
const EMAIL_VERIFY_TOKEN_TTL = process.env.EMAIL_VERIFY_TOKEN_TTL || '15m'
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12)
const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH || 8)
const ALLOW_DEV_OTP_RESPONSE = String(process.env.ALLOW_DEV_OTP_RESPONSE || 'true').toLowerCase() === 'true'
const REQUIRE_OTP_FOR_REGISTER = String(process.env.REQUIRE_OTP_FOR_REGISTER || 'true').toLowerCase() === 'true'
const REQUIRE_OTP_FOR_LOGIN = String(process.env.REQUIRE_OTP_FOR_LOGIN || 'true').toLowerCase() === 'true'
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'unsafe-dev-access-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'unsafe-dev-refresh-secret'
const JWT_EMAIL_VERIFY_SECRET = process.env.JWT_EMAIL_VERIFY_SECRET || 'unsafe-dev-email-secret'
const DB_PATH = path.resolve(__dirname, '..', process.env.AUTH_DB_PATH || 'data/auth.db')

if (
  !process.env.JWT_ACCESS_SECRET ||
  !process.env.JWT_REFRESH_SECRET ||
  !process.env.JWT_EMAIL_VERIFY_SECRET
) {
  console.warn('Warning: Using fallback JWT secrets. Set JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_EMAIL_VERIFY_SECRET.')
}

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    jti TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_jti ON refresh_tokens(jti);
`)

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
)

app.use(
  '/auth',
  rateLimit({
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 60 * 1000),
    max: Number(process.env.AUTH_RATE_LIMIT_MAX || 80),
    standardHeaders: true,
    legacyHeaders: false,
  })
)

const otpStore = new Map()

const hasSmtpConfig =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS)

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getOrCreateOtp(email) {
  const token = String(crypto.randomInt(100000, 1000000))
  const expiresAt = Date.now() + OTP_TTL_MS
  otpStore.set(email, { token, expiresAt, attempts: 0 })
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

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function toIsoFromNow(ms) {
  return new Date(Date.now() + ms).toISOString()
}

function parseDurationMs(input) {
  const value = String(input || '').trim()
  const match = /^(\d+)(ms|s|m|h|d)$/.exec(value)
  if (!match) {
    return 30 * 24 * 60 * 60 * 1000
  }

  const amount = Number(match[1])
  const unit = match[2]
  const unitMs = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return amount * unitMs[unit]
}

function createEmailVerificationToken(email) {
  return jwt.sign({ sub: email, purpose: 'email-verification' }, JWT_EMAIL_VERIFY_SECRET, {
    expiresIn: EMAIL_VERIFY_TOKEN_TTL,
  })
}

function verifyEmailVerificationToken(token, email) {
  try {
    const payload = jwt.verify(token, JWT_EMAIL_VERIFY_SECRET)
    return payload.purpose === 'email-verification' && payload.sub === email
  } catch {
    return false
  }
}

function sanitizeUser(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || null,
    createdAt: row.created_at,
  }
}

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      displayName: user.display_name || null,
      scope: 'access',
    },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  )
}

function createRefreshToken(userId, jti) {
  return jwt.sign(
    {
      sub: String(userId),
      jti,
      scope: 'refresh',
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  )
}

function authRequired(req, res, next) {
  const authHeader = String(req.headers.authorization || '')
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ ok: false, message: 'Missing or invalid authorization header.' })
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET)
    if (payload.scope !== 'access') {
      return res.status(401).json({ ok: false, message: 'Invalid access token scope.' })
    }

    req.auth = payload
    return next()
  } catch {
    return res.status(401).json({ ok: false, message: 'Invalid or expired access token.' })
  }
}

setInterval(purgeExpiredOtps, 60 * 1000).unref()

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'safeeats-auth-server', dbPath: DB_PATH })
})

app.post('/auth/send-otp', async (req, res) => {
  const email = normalizeEmail(req.body?.email)

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' })
  }

  const { token, expiresAt } = getOrCreateOtp(email)

  if (!hasSmtpConfig || !transporter) {
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
    if (ALLOW_DEV_OTP_RESPONSE) {
      return res.json({
        ok: true,
        message: 'Email send failed. Returning OTP in dev mode.',
        expiresAt,
        devOtp: token,
      })
    }

    otpStore.delete(email)
    return res.status(500).json({ ok: false, message: 'Failed to send email.', detail: error.message })
  }
})

app.post('/auth/verify-otp', (req, res) => {
  const email = normalizeEmail(req.body?.email)
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

  if (record.attempts >= 5) {
    otpStore.delete(email)
    return res.status(429).json({ ok: false, message: 'Too many incorrect attempts. Request a new code.' })
  }

  if (record.token !== token) {
    record.attempts += 1
    otpStore.set(email, record)
    return res.status(400).json({ ok: false, message: 'Incorrect code.' })
  }

  otpStore.delete(email)
  const verificationToken = createEmailVerificationToken(email)
  return res.json({ ok: true, message: 'Email verified.', verificationToken })
})

app.post('/auth/register', (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password || '')
  const displayName = String(req.body?.displayName || '').trim() || null
  const verificationToken = String(req.body?.verificationToken || '').trim()

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' })
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ ok: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  }

  if (REQUIRE_OTP_FOR_REGISTER && !verifyEmailVerificationToken(verificationToken, email)) {
    return res.status(401).json({ ok: false, message: 'Email verification is required before registration.' })
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existingUser) {
    return res.status(409).json({ ok: false, message: 'Account already exists. Please sign in.' })
  }

  const now = new Date().toISOString()
  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS)

  const result = db
    .prepare(
      'INSERT INTO users (email, password_hash, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    )
    .run(email, passwordHash, displayName, now, now)

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  return res.status(201).json({ ok: true, message: 'Account created.', user: sanitizeUser(user) })
})

app.post('/auth/login', (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password || '')
  const verificationToken = String(req.body?.verificationToken || '').trim()

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' })
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ ok: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  }

  if (REQUIRE_OTP_FOR_LOGIN && !verifyEmailVerificationToken(verificationToken, email)) {
    return res.status(401).json({ ok: false, message: 'Email verification is required before login.' })
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(404).json({ ok: false, message: 'Account not found. Please register first.' })
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash)
  if (!isPasswordValid) {
    return res.status(401).json({ ok: false, message: 'Incorrect password.' })
  }

  const jti = crypto.randomUUID()
  const accessToken = createAccessToken(user)
  const refreshToken = createRefreshToken(user.id, jti)

  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, jti, expires_at, revoked_at, created_at) VALUES (?, ?, ?, ?, NULL, ?)'
  ).run(
    user.id,
    sha256(refreshToken),
    jti,
    toIsoFromNow(parseDurationMs(REFRESH_TOKEN_TTL)),
    new Date().toISOString()
  )

  return res.json({
    ok: true,
    message: 'Login successful.',
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  })
})

app.post('/auth/refresh', (req, res) => {
  const refreshToken = String(req.body?.refreshToken || '').trim()

  if (!refreshToken) {
    return res.status(400).json({ ok: false, message: 'refreshToken is required.' })
  }

  let payload
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
  } catch {
    return res.status(401).json({ ok: false, message: 'Invalid or expired refresh token.' })
  }

  if (payload.scope !== 'refresh' || !payload.jti) {
    return res.status(401).json({ ok: false, message: 'Invalid refresh token scope.' })
  }

  const storedToken = db
    .prepare('SELECT * FROM refresh_tokens WHERE jti = ? AND token_hash = ?')
    .get(payload.jti, sha256(refreshToken))

  if (!storedToken || storedToken.revoked_at) {
    return res.status(401).json({ ok: false, message: 'Refresh token already revoked.' })
  }

  if (new Date(storedToken.expires_at).getTime() <= Date.now()) {
    return res.status(401).json({ ok: false, message: 'Refresh token expired.' })
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub)
  if (!user) {
    return res.status(401).json({ ok: false, message: 'User not found for token.' })
  }

  const newJti = crypto.randomUUID()
  const newAccessToken = createAccessToken(user)
  const newRefreshToken = createRefreshToken(user.id, newJti)
  const now = new Date().toISOString()

  const tx = db.transaction(() => {
    db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?').run(now, storedToken.id)
    db.prepare(
      'INSERT INTO refresh_tokens (user_id, token_hash, jti, expires_at, revoked_at, created_at) VALUES (?, ?, ?, ?, NULL, ?)'
    ).run(user.id, sha256(newRefreshToken), newJti, toIsoFromNow(parseDurationMs(REFRESH_TOKEN_TTL)), now)
  })

  tx()

  return res.json({
    ok: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: sanitizeUser(user),
  })
})

app.post('/auth/logout', (req, res) => {
  const refreshToken = String(req.body?.refreshToken || '').trim()
  if (!refreshToken) {
    return res.json({ ok: true, message: 'Logout successful.' })
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    if (payload.jti) {
      db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE jti = ?').run(new Date().toISOString(), payload.jti)
    }
  } catch {
    // Always return success to keep logout idempotent.
  }

  return res.json({ ok: true, message: 'Logout successful.' })
})

app.get('/auth/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.auth.sub)
  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found.' })
  }

  return res.json({ ok: true, user: sanitizeUser(user) })
})

app.listen(PORT, () => {
  console.log(`SafeEats auth server running on http://localhost:${PORT}`)
})
