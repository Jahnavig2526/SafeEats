import { useMemo, useState } from 'react'
import { Image, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { Card } from '../components/Card'
import type { UserIntakeProfile } from '../types'

const allergyOptions = ['Peanuts', 'Dairy', 'Eggs', 'Wheat', 'Soy', 'Shellfish']

type ProfileScreenProps = {
  profile: UserIntakeProfile | null
}

export function ProfileScreen({ profile }: ProfileScreenProps) {
  const [sensitivity, setSensitivity] = useState(1)
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Peanuts: true,
    Dairy: true,
    Eggs: false,
    Wheat: false,
    Soy: false,
    Shellfish: true,
  })

  const sensitivityLabel = useMemo(() => {
    if (sensitivity < 0.5) return 'Strict'
    if (sensitivity < 1.5) return 'Moderate'
    return 'Flexible'
  }, [sensitivity])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Ava Johnson</Text>
            <Text style={styles.meta}>Peanut and dairy-sensitive</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.title}>Allergy Selection</Text>
      {allergyOptions.map((allergy) => (
        <Card key={allergy}>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>{allergy}</Text>
            <Switch
              value={selected[allergy]}
              onValueChange={(value) => setSelected((prev) => ({ ...prev, [allergy]: value }))}
              thumbColor="#ffffff"
              trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
            />
          </View>
        </Card>
      ))}

      <Card>
        <Text style={styles.title}>Sensitivity: {sensitivityLabel}</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Strict</Text>
          <Switch
            value={sensitivity > 1}
            onValueChange={(v) => setSensitivity(v ? 2 : 0)}
            thumbColor="#ffffff"
            trackColor={{ false: '#eab308', true: '#22c55e' }}
          />
          <Text style={styles.sliderLabel}>Flexible</Text>
        </View>
        <Text style={styles.meta}>Use strict mode for trace-level allergen avoidance.</Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
    backgroundColor: '#f8fafc',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    color: '#64748b',
    fontSize: 13,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#334155',
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  sliderLabel: {
    color: '#475569',
    fontWeight: '600',
  },
})
