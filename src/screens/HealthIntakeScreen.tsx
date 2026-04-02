import { Feather } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'

type HealthIntakeScreenProps = {
  userEmail: string
  onComplete: (payload: { allergies: string[]; healthIssues: string[]; sensitivity: 'Strict' | 'Moderate' | 'Flexible' }) => void
}

const allergyTiles = [
  { key: 'Milk', label: 'Milk', color: 'milk' },
  { key: 'Eggs', label: 'Eggs', color: 'eggs' },
  { key: 'Gluten', label: 'Gluten', color: 'gluten' },
  { key: 'Soy', label: 'Soy', color: 'soy' },
  { key: 'Peanuts', label: 'Peanuts', color: 'peanuts' },
  { key: 'Peanut', label: 'Soy', color: 'soy' },
  { key: 'Peanuts-2', label: 'Peanuts', color: 'peanuts' },
  { key: 'Fish', label: 'Fish', color: 'fish' },
] as const

const healthIssueTiles = [
  { key: 'Asthma', label: 'Asthma', icon: 'lock' as const, tone: 'warning' as const },
  { key: 'Eczema', label: 'Eczema', icon: 'star' as const, tone: 'muted' as const },
  { key: 'High BP', label: 'High BP', icon: 'star' as const, tone: 'muted' as const },
  { key: 'Celiac', label: 'Celiac', icon: 'star' as const, tone: 'muted' as const },
]

const sensitivityOptions: Array<'Strict' | 'Moderate' | 'Flexible'> = ['Strict', 'Moderate', 'Flexible']

export function HealthIntakeScreen({ userEmail, onComplete }: HealthIntakeScreenProps) {
  const [allergies, setAllergies] = useState<string[]>(['Peanuts'])
  const [healthIssues, setHealthIssues] = useState<string[]>(['Eczema', 'High BP'])
  const [sensitivity, setSensitivity] = useState<(typeof sensitivityOptions)[number]>('Moderate')
  const { width } = useWindowDimensions()
  const isWide = width >= 760

  const canContinue = useMemo(() => allergies.length > 0, [allergies.length])

  const toggleValue = (value: string, collection: string[], setCollection: (next: string[]) => void) => {
    if (collection.includes(value)) {
      setCollection(collection.filter((item) => item !== value))
      return
    }
    setCollection([...collection, value])
  }

  return (
    <View style={styles.screen}>
      <View style={styles.flowerLeft} />
      <View style={styles.flowerRight} />
      <View style={styles.flowerBottomLeft} />
      <View style={styles.flowerBottomRight} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.phoneFrame}>
          <View style={styles.topBar}>
            <Pressable style={styles.topButton}>
              <Feather name="chevron-left" size={26} color="#3b4757" />
            </Pressable>
            <Pressable style={styles.topButton}>
              <Feather name="heart" size={24} color="#3b4757" />
            </Pressable>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Set Your Preferences</Text>
            <Text style={styles.subtitle}>Personalize your settings to find safe food options for you.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Food Allergies</Text>
            <View style={[styles.allergyRow, !isWide && styles.allergyRowCompact]}>
              {allergyTiles.map((tile) => {
                const isSelected = allergies.includes(tile.key)
                return (
                  <Pressable
                    key={tile.key}
                    style={[
                      styles.tileButton,
                      !isWide && styles.tileButtonCompact,
                      isSelected && styles.tileButtonSelected,
                    ]}
                    onPress={() => toggleValue(tile.key, allergies, setAllergies)}
                  >
                    <View style={[styles.tileCapsule, styles[`capsule_${tile.color}` as const], !isSelected && styles.tileDim]}>
                      <View style={styles.tileCapsuleTop} />
                      <View style={styles.tileCapsuleBottom} />
                    </View>
                    <Text style={[styles.tileLabel, isSelected && styles.tileLabelActive]}>{tile.label}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Health Issues</Text>
            <View style={styles.issueRow}>
              {healthIssueTiles.map((tile) => {
                const isSelected = healthIssues.includes(tile.key)
                return (
                  <Pressable
                    key={tile.key}
                    style={[
                      styles.issuePill,
                      tile.tone === 'warning' && styles.issueWarning,
                      tile.tone === 'muted' && styles.issueMuted,
                      isSelected && styles.issuePillActive,
                    ]}
                    onPress={() => toggleValue(tile.key, healthIssues, setHealthIssues)}
                  >
                    <View style={[styles.issueIcon, tile.tone === 'warning' && styles.issueIconWarning, tile.tone === 'muted' && styles.issueIconMuted]}>
                      <Feather name={tile.icon} size={13} color="#ffffff" />
                    </View>
                    <Text style={styles.issueLabel}>{tile.label}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Sensitivity</Text>
            <View style={styles.segmentWrap}>
              {sensitivityOptions.map((option) => {
                const isActive = sensitivity === option
                return (
                  <Pressable key={option} style={[styles.segmentButton, isActive && styles.segmentButtonActive]} onPress={() => setSensitivity(option)}>
                    <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>{option}</Text>
                  </Pressable>
                )
              })}
            </View>

            <Pressable
              disabled={!canContinue}
              onPress={() => onComplete({ allergies, healthIssues, sensitivity })}
              style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            >
              <Text style={styles.continueButtonText}>Continue to SafeEats</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3efe8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  phoneFrame: {
    borderRadius: 30,
    backgroundColor: '#fffdfb',
    borderWidth: 1,
    borderColor: '#ece7df',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topButton: {
    width: 54,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#fff6f2',
    borderWidth: 1,
    borderColor: '#eee6de',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    color: '#3d4d5d',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#7a8088',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee7df',
    backgroundColor: '#fffefc',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sectionTitle: {
    color: '#374354',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  allergyRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  allergyRowCompact: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  tileButton: {
    alignItems: 'center',
    width: 60,
    borderRadius: 18,
    paddingVertical: 8,
  },
  tileButtonCompact: {
    width: 64,
  },
  tileButtonSelected: {
    backgroundColor: '#edf8ef',
    borderWidth: 1,
    borderColor: '#d3ebd9',
  },
  tileCapsule: {
    width: 30,
    height: 56,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 6,
  },
  tileCapsuleTop: {
    flex: 1,
    backgroundColor: '#f7dcc0',
  },
  tileCapsuleBottom: {
    flex: 1,
    backgroundColor: '#e3bf96',
  },
  capsule_milk: {
    backgroundColor: '#f3d6b4',
  },
  capsule_eggs: {
    backgroundColor: '#f6a03a',
  },
  capsule_gluten: {
    backgroundColor: '#f7a232',
  },
  capsule_soy: {
    backgroundColor: '#f79d2d',
  },
  capsule_peanuts: {
    backgroundColor: '#64c156',
  },
  capsule_fish: {
    backgroundColor: '#f6cb53',
  },
  tileDim: {
    opacity: 0.34,
  },
  tileLabel: {
    color: '#6d737b',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
  },
  tileLabelActive: {
    color: '#3d4d5d',
  },
  issueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  issuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f7f1ea',
    borderWidth: 1,
    borderColor: '#eee6dc',
  },
  issuePillActive: {
    backgroundColor: '#edf8ef',
    borderColor: '#d3ebd9',
  },
  issueWarning: {
    backgroundColor: '#f8f0e6',
  },
  issueSuccess: {
    backgroundColor: '#edf5ea',
  },
  issueMuted: {
    backgroundColor: '#f5efe7',
  },
  issueIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1a52d',
  },
  issueIconWarning: {
    backgroundColor: '#f0b33a',
  },
  issueIconSuccess: {
    backgroundColor: '#83cb67',
  },
  issueIconMuted: {
    backgroundColor: '#f0ce7d',
  },
  issueLabel: {
    color: '#5d636a',
    fontSize: 15,
    fontWeight: '600',
  },
  segmentWrap: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e3ded7',
    backgroundColor: '#faf7f3',
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e3ded7',
  },
  segmentButtonActive: {
    backgroundColor: '#ff8a1a',
    borderRightColor: '#ff8a1a',
  },
  segmentLabel: {
    color: '#6f737b',
    fontSize: 16,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  continueButton: {
    alignSelf: 'center',
    marginTop: 16,
    minWidth: 250,
    borderRadius: 999,
    backgroundColor: '#24c691',
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a8e67',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.55,
  },
  continueButtonText: {
    color: '#fafffd',
    fontSize: 18,
    fontWeight: '800',
  },
  flowerLeft: {
    position: 'absolute',
    left: -16,
    top: 76,
    width: 86,
    height: 200,
    borderRadius: 28,
    backgroundColor: '#efeee8',
    opacity: 0.75,
  },
  flowerRight: {
    position: 'absolute',
    right: -10,
    top: 72,
    width: 88,
    height: 240,
    borderRadius: 28,
    backgroundColor: '#efeee8',
    opacity: 0.72,
  },
  flowerBottomLeft: {
    position: 'absolute',
    left: 20,
    bottom: 12,
    width: 120,
    height: 78,
    borderRadius: 30,
    backgroundColor: '#eef6ee',
    opacity: 0.75,
  },
  flowerBottomRight: {
    position: 'absolute',
    right: 16,
    bottom: 10,
    width: 110,
    height: 84,
    borderRadius: 30,
    backgroundColor: '#fce8dd',
    opacity: 0.75,
  },
})
