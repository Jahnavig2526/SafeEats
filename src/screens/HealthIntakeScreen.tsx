import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type HealthIntakeScreenProps = {
  userEmail: string
  onComplete: (payload: { allergies: string[]; healthIssues: string[]; sensitivity: 'Strict' | 'Moderate' | 'Flexible' }) => void
}

const allergyTiles = [
  { key: 'Milk', label: 'Milk', kind: 'milk' as const },
  { key: 'Eggs', label: 'Eggs', kind: 'icon' as const, icon: 'egg' as const },
  { key: 'Gluten', label: 'Gluten', kind: 'gluten' as const },
  { key: 'Soy', label: 'Soy', kind: 'icon' as const, icon: 'soy-sauce' as const },
  { key: 'Peanuts', label: 'Peanuts', kind: 'icon' as const, icon: 'peanut' as const },
  { key: 'Fish', label: 'Fish', kind: 'icon' as const, icon: 'fish' as const },
] as const

const healthIssueTiles = [
  { key: 'Asthma', label: 'Asthma', icon: 'lungs' as const },
  { key: 'Eczema', label: 'Eczema', icon: 'water-percent' as const },
  { key: 'High BP', label: 'High BP', icon: 'heart-pulse' as const },
  { key: 'Celiac', label: 'Celiac', icon: 'barley' as const, selected: true },
]

const sensitivityOptions: Array<'Strict' | 'Moderate' | 'Flexible'> = ['Strict', 'Moderate', 'Flexible']

function MilkBottleIcon() {
  return (
    <View style={styles.milkBottleWrap}>
      <View style={styles.milkBottleCap} />
      <View style={styles.milkBottleNeck} />
      <View style={styles.milkBottleBody}>
        <View style={styles.milkLabel}>
          <Text style={styles.milkLabelText}>MILK</Text>
        </View>
      </View>
    </View>
  )
}

function GlutenIcon() {
  return (
    <View style={styles.glutenWrap}>
      <MaterialCommunityIcons name="barley" size={46} color="#2d2d2d" />
    </View>
  )
}

export function HealthIntakeScreen({ userEmail, onComplete }: HealthIntakeScreenProps) {
  const [allergies, setAllergies] = useState<string[]>(['Peanuts'])
  const [healthIssues, setHealthIssues] = useState<string[]>(['Celiac'])
  const [sensitivity, setSensitivity] = useState<(typeof sensitivityOptions)[number]>('Moderate')

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.phoneFrame}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Your Preferences</Text>
            <Text style={styles.subtitle}>Personalize your settings to find safe food options for you.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Food Allergies</Text>
            <View style={styles.allergyGrid}>
              {allergyTiles.map((tile) => {
                const isSelected = allergies.includes(tile.key)
                return (
                  <Pressable
                    key={tile.key}
                    style={[styles.allergyTile, isSelected && styles.allergyTileSelected]}
                    onPress={() => toggleValue(tile.key, allergies, setAllergies)}
                  >
                    <View style={[styles.allergyIconCircle, isSelected && styles.allergyIconCircleSelected]}>
                      {tile.kind === 'milk' ? (
                        <MilkBottleIcon />
                      ) : tile.kind === 'gluten' ? (
                        <GlutenIcon />
                      ) : (
                        <MaterialCommunityIcons name={tile.icon} size={isSelected ? 42 : 40} color={isSelected ? '#c98b3a' : '#4b5a73'} />
                      )}
                    </View>
                    <Text style={[styles.tileLabel, isSelected && styles.tileLabelActive]}>{tile.label}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Relevant Medical Conditions</Text>
            <View style={styles.issueRow}>
              {healthIssueTiles.map((tile) => {
                const isSelected = healthIssues.includes(tile.key)
                return (
                  <Pressable
                    key={tile.key}
                    style={[styles.issuePill, isSelected && styles.issuePillActive, tile.selected && styles.issuePillAccent]}
                    onPress={() => toggleValue(tile.key, healthIssues, setHealthIssues)}
                  >
                    <View style={[styles.issueIcon, tile.selected ? styles.issueIconAccent : styles.issueIconMuted]}>
                      <MaterialCommunityIcons name={tile.icon} size={14} color="#ffffff" />
                    </View>
                    <Text style={[styles.issueLabel, tile.selected && styles.issueLabelSelected]}>{tile.label}</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  phoneFrame: {
    borderRadius: 34,
    backgroundColor: '#fffdfb',
    borderWidth: 1,
    borderColor: '#ece7df',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    fontSize: 31,
    lineHeight: 35,
    fontWeight: '800',
    color: '#13284a',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#31415d',
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
    color: '#13284a',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  allergyGrid: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  allergyTile: {
    alignItems: 'center',
    width: '31%',
    paddingVertical: 6,
  },
  allergyTileSelected: {
    opacity: 1,
  },
  allergyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2ede5',
  },
  allergyIconCircleSelected: {
    backgroundColor: '#fff2d9',
    borderWidth: 2,
    borderColor: '#c98b3a',
  },
  tileLabel: {
    marginTop: 10,
    color: '#273751',
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
  tileLabelActive: {
    color: '#c98b3a',
  },
  milkBottleWrap: {
    width: 42,
    height: 54,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  milkBottleCap: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2d3d56',
    marginTop: 2,
  },
  milkBottleNeck: {
    width: 12,
    height: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#3c4f6d',
    marginTop: 2,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  milkBottleBody: {
    width: 30,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3c4f6d',
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milkLabel: {
    width: 28,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#3c4f6d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milkLabelText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#2d2d2d',
    letterSpacing: 1.2,
  },
  glutenWrap: {
    width: 42,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
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
  issuePillAccent: {
    backgroundColor: '#edf8ef',
  },
  issueIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7d7d7d',
  },
  issueIconAccent: {
    backgroundColor: '#2fc89a',
  },
  issueIconMuted: {
    backgroundColor: '#a9a299',
  },
  issueLabel: {
    color: '#5d636a',
    fontSize: 15,
    fontWeight: '600',
  },
  issueLabelSelected: {
    color: '#2e3d55',
    fontWeight: '700',
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
})
