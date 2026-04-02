import { ReactNode } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

type ButtonVariant = 'safe' | 'danger' | 'neutral' | 'accent'

type ButtonProps = {
  label: string
  onPress?: () => void
  variant?: ButtonVariant
  icon?: ReactNode
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  safe: { bg: '#22c55e', text: '#ffffff' },
  danger: { bg: '#ef4444', text: '#ffffff' },
  neutral: { bg: '#0f172a', text: '#ffffff' },
  accent: { bg: '#f97316', text: '#ffffff' },
}

export function Button({ label, onPress, variant = 'safe', icon, disabled = false, style, textStyle }: ButtonProps) {
  const palette = variantStyles[variant]

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, { color: palette.text }, textStyle]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
})
