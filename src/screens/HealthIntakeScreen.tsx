import { useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

type HealthIntakeScreenProps = {
  userEmail: string
  onComplete: (payload: { allergies: string[]; healthIssues: string[]; sensitivity: 'Strict' | 'Moderate' | 'Flexible' }) => void
}

const allergyOptions = [
  'Milk',
  'Eggs',
  'Gluten',
  'Wheat',
  'Soy',
  'Peanuts',
  'Tree Nuts',
  'Fish',
  'Shellfish',
  'Sesame',
]

const healthIssueOptions = ['Asthma', 'Eczema', 'Diabetes', 'High BP', 'IBS', 'Celiac']

const sensitivityLevels = ['Strict', 'Moderate', 'Flexible'] as const

const onboardingCards = [
  {
    title: 'Respiratory allergies',
    body: 'Track breathing-trigger risks like pollen-sensitive ingredients and airborne irritants in food spaces.',
    imageUrl:
      'https://image.shutterstock.com/shutterstock/photos/1451466050/display_1500/stock-vector-respiratory-allergies-concept-icon-airborne-allergic-diseases-idea-thin-line-illustration-house-1451466050.jpg',
  },
  {
    title: 'Skin allergies',
    body: 'Capture eczema and contact-trigger patterns so SafeEats can rank safer restaurants and dishes.',
    imageUrl:
      'https://png.pngtree.com/png-vector/20221124/ourmid/pngtree-skin-allergy-icon-with-rash-hives-and-causes-vector-png-image_41999066.jpg',
  },
  {
    title: 'Eye allergies',
    body: 'Include watery-eye triggers and sensitivity trends to improve alerts during menu scanning.',
    imageUrl:
      'https://media.istockphoto.com/id/1209437444/vector/eye-allergies-concept-icon-allergic-conjunctivitis-idea-thin-line-illustration-seasonal.jpg?s=1024x1024&w=is&k=20&c=5aSI9XO5FMzG8zUTgRyoLj-OdKmGLfUUDNrjoEzeKkE=',
  },
]

export function HealthIntakeScreen({ userEmail, onComplete }: HealthIntakeScreenProps) {
  const [allergies, setAllergies] = useState<string[]>(['Peanuts'])
  const [healthIssues, setHealthIssues] = useState<string[]>([])
  const [sensitivity, setSensitivity] = useState<(typeof sensitivityLevels)[number]>('Moderate')
  const [introIndex, setIntroIndex] = useState(0)
  const [showIntake, setShowIntake] = useState(false)

  const canContinue = useMemo(() => allergies.length > 0, [allergies.length])

  const toggleInArray = (value: string, state: string[], setState: (next: string[]) => void) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value))
      return
    }
    setState([...state, value])
  }

  if (!showIntake) {
    const active = onboardingCards[introIndex]

    return (
      <View style={styles.introContainer}>
        <Card style={styles.introCard}>
          <View style={styles.introImageFrame}>
            <Image source={{ uri: active.imageUrl }} style={styles.introImage} resizeMode="contain" />
          </View>
          <Text style={styles.introTitle}>{active.title}</Text>
          <Text style={styles.introBody}>{active.body}</Text>

          <View style={styles.dotsRow}>
            {onboardingCards.map((_, idx) => (
              <View key={idx} style={[styles.dot, idx === introIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.introFooter}>
            <Pressable onPress={() => setShowIntake(true)}>
              <Text style={styles.introAction}>SKIP</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (introIndex === onboardingCards.length - 1) {
                  setShowIntake(true)
                  return
                }
                setIntroIndex((prev) => prev + 1)
              }}
            >
              <Text style={styles.introAction}>NEXT</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Set Your Preferences</Text>
        <Text style={styles.subtitle}>Signed in as {userEmail}</Text>

        <Text style={styles.sectionLabel}>Food allergies</Text>
        <View style={styles.chipsWrap}>
          {allergyOptions.map((option) => {
            const selected = allergies.includes(option)
            return (
              <Pressable
                key={option}
                onPress={() => toggleInArray(option, allergies, setAllergies)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option}</Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.sectionLabel}>Health issues</Text>
        <View style={styles.chipsWrap}>
          {healthIssueOptions.map((option) => {
            const selected = healthIssues.includes(option)
            return (
              <Pressable
                key={option}
                onPress={() => toggleInArray(option, healthIssues, setHealthIssues)}
                style={[styles.chip, selected && styles.chipSelectedAlt]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option}</Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.sectionLabel}>Sensitivity</Text>
        <View style={styles.sensitivityRow}>
          {sensitivityLevels.map((level) => {
            const active = level === sensitivity
            return (
              <Pressable
                key={level}
                onPress={() => setSensitivity(level)}
                style={[styles.sensitivityPill, active && styles.sensitivityPillActive]}
              >
                <Text style={[styles.sensitivityText, active && styles.sensitivityTextActive]}>{level}</Text>
              </Pressable>
            )
          })}
        </View>

        <Button label="Continue to SafeEats" onPress={() => onComplete({ allergies, healthIssues, sensitivity })} />

        {!canContinue && <Text style={styles.hint}>Select at least one allergy to continue.</Text>}
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#a7dde0',
  },
  introCard: {
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#bfeef0',
    minHeight: 600,
    justifyContent: 'space-between',
  },
  introImageFrame: {
    width: '100%',
    backgroundColor: '#e8f8f9',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introImage: {
    width: '92%',
    height: 260,
    borderRadius: 14,
    alignSelf: 'center',
    backgroundColor: '#e8f8f9',
  },
  introTitle: {
    textAlign: 'center',
    color: '#0c4a6e',
    fontWeight: '700',
    fontSize: 31,
    lineHeight: 37,
  },
  introBody: {
    textAlign: 'center',
    color: '#0f5e83',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#5aa6b8',
    opacity: 0.35,
  },
  dotActive: {
    opacity: 1,
  },
  introFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  introAction: {
    color: '#0f5e83',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.8,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f6f5f2',
    padding: 20,
    paddingVertical: 24,
  },
  card: {
    borderRadius: 26,
    padding: 20,
    gap: 11,
    shadowOpacity: 0.04,
    elevation: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#101828',
  },
  subtitle: {
    color: '#98a2b3',
    marginBottom: 8,
  },
  sectionLabel: {
    marginTop: 6,
    color: '#101828',
    fontWeight: '700',
    fontSize: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#edf0f2',
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  chipSelectedAlt: {
    backgroundColor: '#ffedd5',
    borderColor: '#f97316',
  },
  chipText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#0f172a',
  },
  sensitivityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sensitivityPill: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#edf0f2',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sensitivityPillActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  sensitivityText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 12,
  },
  sensitivityTextActive: {
    color: '#fff',
  },
  hint: {
    color: '#f97316',
    textAlign: 'center',
    fontSize: 12,
  },
})
