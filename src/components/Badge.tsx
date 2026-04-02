import { StyleSheet, Text, View } from 'react-native'
import type { SafetyStatus } from '../types'

type BadgeProps = {
  status: SafetyStatus
}

const labels: Record<SafetyStatus, string> = {
  safe: 'Safe',
  unsafe: 'Contains allergens',
  uncertain: 'Uncertain',
}

const colors: Record<SafetyStatus, { bg: string; text: string }> = {
  safe: { bg: '#dcfce7', text: '#22c55e' },
  unsafe: { bg: '#fee2e2', text: '#ef4444' },
  uncertain: { bg: '#fef9c3', text: '#a16207' },
}

export function Badge({ status }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: colors[status].bg }]}>
      <Text style={[styles.text, { color: colors[status].text }]}>{labels[status]}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
})
