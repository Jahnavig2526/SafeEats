import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Card } from '../components/Card'
import { Button } from '../components/Button'

type LoginScreenProps = {
  onLogin: (email: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const authApiBaseUrl = process.env.EXPO_PUBLIC_AUTH_API_BASE_URL?.trim()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [hasSentCode, setHasSentCode] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const sendVerificationCode = async () => {
    if (!isEmailFormatValid) {
      setErrorMessage('Please enter a valid email address first.')
      setInfoMessage('')
      return
    }

    if (!authApiBaseUrl) {
      setErrorMessage('Auth API is not configured. Add EXPO_PUBLIC_AUTH_API_BASE_URL in .env.')
      setInfoMessage('')
      return
    }

    try {
      setIsSendingCode(true)
      setErrorMessage('')
      setInfoMessage('')

      const response = await fetch(`${authApiBaseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })
      const payload = (await response.json()) as { ok: boolean; message?: string; devOtp?: string }

      if (!response.ok || !payload.ok) {
        setErrorMessage(payload.message || 'Failed to send verification code.')
        return
      }

      setHasSentCode(true)
      setIsEmailVerified(false)
      setVerificationCode('')
      if (payload.devOtp) {
        setInfoMessage(`Dev mode code for ${email.trim()}: ${payload.devOtp}`)
        Alert.alert('SafeEats OTP (Dev Mode)', `Use this code to verify:\n${payload.devOtp}`)
      } else {
        setInfoMessage(`Verification code sent to ${email.trim()}. Check inbox and spam folder.`)
      }
    } finally {
      setIsSendingCode(false)
    }
  }

  const verifyCode = async () => {
    if (!hasSentCode) {
      setErrorMessage('Send verification code first.')
      setInfoMessage('')
      return
    }

    if (verificationCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.')
      setInfoMessage('')
      return
    }

    if (!authApiBaseUrl) {
      setErrorMessage('Auth API is not configured. Add EXPO_PUBLIC_AUTH_API_BASE_URL in .env.')
      setInfoMessage('')
      return
    }

    try {
      setIsVerifyingCode(true)
      setErrorMessage('')
      setInfoMessage('')

      const response = await fetch(`${authApiBaseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), token: verificationCode.trim() }),
      })
      const payload = (await response.json()) as { ok: boolean; message?: string }

      if (!response.ok || !payload.ok) {
        setErrorMessage(payload.message || 'Failed to verify code.')
        setIsEmailVerified(false)
        return
      }

      setInfoMessage('Email verified successfully. You can now sign in.')
      setIsEmailVerified(true)
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const canSignIn = isEmailVerified && password.trim().length > 0

  const previewLogin = () => {
    const fallbackEmail = 'preview@safeeats.app'
    onLogin(isEmailFormatValid ? email.trim() : fallbackEmail)
  }

  const signIn = async () => {
    if (!canSignIn) {
      return
    }

    try {
      setIsSigningIn(true)
      setErrorMessage('')
      setInfoMessage('')
      onLogin(email.trim())
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Login Account</Text>
        <Text style={styles.subtitle}>Please login with registered account</Text>

        <View style={styles.inputWrap}>
          <Feather name="mail" size={16} color="#94a3b8" />
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value)
              setIsEmailVerified(false)
            }}
            placeholder="Enter your email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.verifyRow}>
          <Button
            label={isSendingCode ? 'Sending...' : hasSentCode ? 'Resend Code' : 'Verify Email'}
            variant="accent"
            disabled={isSendingCode}
            onPress={sendVerificationCode}
            style={styles.verifyBtn}
          />
        </View>

        {hasSentCode && (
          <>
            <View style={styles.inputWrap}>
              <Feather name="shield" size={16} color="#94a3b8" />
              <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter 6-digit verification code"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <Button
              label={isVerifyingCode ? 'Verifying...' : 'Confirm Email Verification'}
              variant="neutral"
              disabled={isVerifyingCode}
              onPress={verifyCode}
            />
          </>
        )}

        <View style={styles.inputWrap}>
          <Feather name="lock" size={16} color="#94a3b8" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create your password"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            secureTextEntry
          />
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!infoMessage && <Text style={styles.infoText}>{infoMessage}</Text>}

        <Pressable style={styles.forgotWrap}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>

        <Button
          label={isSigningIn ? 'Signing In...' : isEmailVerified ? 'Sign In' : 'Verify Email To Sign In'}
          variant="accent"
          disabled={!canSignIn || isSigningIn}
          onPress={signIn}
        />

        <Button label="Preview App (Skip Login)" variant="neutral" onPress={previewLogin} />

        <Text style={styles.orText}>Or using other method</Text>

        <Pressable style={styles.socialBtn}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialText}>Sign In with Google</Text>
        </Pressable>
        <Pressable style={styles.socialBtn}>
          <Text style={styles.socialIcon}>f</Text>
          <Text style={styles.socialText}>Sign In with Facebook</Text>
        </Pressable>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f3f0ec',
    padding: 20,
  },
  card: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 26,
    gap: 12,
    shadowOpacity: 0.07,
    elevation: 2,
  },
  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  subtitle: {
    color: '#98a2b3',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#edf0f2',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 11,
    backgroundColor: '#fffdfb',
  },
  input: {
    flex: 1,
    color: '#101828',
    fontSize: 14,
  },
  verifyRow: {
    marginTop: -2,
  },
  verifyBtn: {
    borderRadius: 12,
    paddingVertical: 11,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  infoText: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '600',
  },
  forgotWrap: {
    alignItems: 'flex-end',
    marginTop: -4,
  },
  forgot: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 12,
  },
  orText: {
    textAlign: 'center',
    color: '#98a2b3',
    marginTop: 2,
    marginBottom: 2,
    fontSize: 12,
  },
  socialBtn: {
    borderWidth: 1,
    borderColor: '#edf0f2',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fff',
  },
  socialIcon: {
    width: 20,
    textAlign: 'center',
    color: '#475467',
    fontWeight: '700',
    fontSize: 14,
  },
  socialText: {
    color: '#344054',
    fontWeight: '600',
    fontSize: 13,
  },
})
