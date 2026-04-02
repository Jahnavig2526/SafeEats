import { Feather } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Card } from '../components/Card'
import { feedbackItems } from '../data/mockData'
import type { UserIntakeProfile } from '../types'

const sensitivityOptions: Array<UserIntakeProfile['sensitivity']> = ['Strict', 'Moderate', 'Flexible']

type ProfileScreenProps = {
  profile: UserIntakeProfile | null
  theme: {
    background: string
    surface: string
    surfaceSoft: string
    text: string
    muted: string
    accent: string
    border: string
  }
  onProfileUpdate?: (updates: Partial<UserIntakeProfile>) => void
}

export function ProfileScreen({ profile, theme, onProfileUpdate }: ProfileScreenProps) {
  const initialSensitivity = useMemo(() => {
    if (profile?.sensitivity === 'Strict') return 0
    if (profile?.sensitivity === 'Flexible') return 2
    return 1
  }, [profile?.sensitivity])

  const [sensitivity, setSensitivity] = useState(initialSensitivity)
  const [allergies, setAllergies] = useState<string[]>(profile?.allergies ?? [])
  const [healthIssues, setHealthIssues] = useState<string[]>(profile?.healthIssues ?? [])
  const [newAllergyInput, setNewAllergyInput] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [reviewInput, setReviewInput] = useState('')

  const colors = useMemo(() => {
    const isLight = theme.background.toLowerCase().startsWith('#f')
    return {
      pageBg: theme.background,
      cardBg: theme.surface,
      softBg: theme.surfaceSoft,
      text: theme.text,
      muted: theme.muted,
      accent: theme.accent,
      border: theme.border,
      inputPlaceholder: isLight ? '#9aa8bb' : '#8fa1ba',
    }
  }, [theme])

  useEffect(() => {
    setAllergies(profile?.allergies ?? [])
    setHealthIssues(profile?.healthIssues ?? [])

    if (profile?.sensitivity === 'Strict') {
      setSensitivity(0)
    } else if (profile?.sensitivity === 'Flexible') {
      setSensitivity(2)
    } else {
      setSensitivity(1)
    }
  }, [profile?.allergies, profile?.healthIssues, profile?.sensitivity])

  const sensitivityLabel = useMemo(() => {
    if (sensitivity < 0.5) return 'Strict'
    if (sensitivity < 1.5) return 'Moderate'
    return 'Flexible'
  }, [sensitivity])

  const activeSensitivityIndex = useMemo(() => {
    if (sensitivity < 0.5) return 0
    if (sensitivity < 1.5) return 1
    return 2
  }, [sensitivity])

  const displayName = profile?.email?.split('@')[0] || 'Profile'
  const summaryText = [
    allergies.length ? `${allergies.length} allergies` : 'No allergies',
    healthIssues.length ? `${healthIssues.length} health issues` : 'No health issues',
  ].join(' • ')

  const handleToggleAllergy = (allergy: string) => {
    const updated = allergies.includes(allergy)
      ? allergies.filter((a) => a !== allergy)
      : [...allergies, allergy]
    setAllergies(updated)
    onProfileUpdate?.({ allergies: updated })
  }

  const handleAddAllergy = () => {
    if (newAllergyInput.trim() && !allergies.includes(newAllergyInput.trim())) {
      const updated = [...allergies, newAllergyInput.trim()]
      setAllergies(updated)
      onProfileUpdate?.({ allergies: updated })
      setNewAllergyInput('')
      setShowAddForm(false)
    }
  }

  const handleToggleHealthIssue = (issue: string) => {
    const updated = healthIssues.includes(issue)
      ? healthIssues.filter((item) => item !== issue)
      : [...healthIssues, issue]

    setHealthIssues(updated)
    onProfileUpdate?.({ healthIssues: updated })
  }

  const handleSensitivityChange = (index: number) => {
    setSensitivity(index)
    onProfileUpdate?.({ sensitivity: sensitivityOptions[index] })
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]} showsVerticalScrollIndicator={false}>
      <Card style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.profileTextWrap}>
            <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.meta, { color: colors.muted }]}>{summaryText}</Text>
          </View>
        </View>
      </Card>

      <Card style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Allergy Selection</Text>
          <Pressable onPress={() => setShowAddForm(!showAddForm)} style={[styles.addButton, { backgroundColor: colors.softBg, borderColor: colors.border }]}>
            <Feather name="plus" size={20} color="#27c06f" />
          </Pressable>
        </View>

        {showAddForm && (
          <View style={styles.addFormContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.softBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter allergy name"
              placeholderTextColor={colors.inputPlaceholder}
              value={newAllergyInput}
              onChangeText={setNewAllergyInput}
              onSubmitEditing={handleAddAllergy}
            />
            <View style={styles.addFormButtons}>
              <Pressable onPress={handleAddAllergy} style={[styles.addSubmitButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.addSubmitText}>Add</Text>
              </Pressable>
              <Pressable onPress={() => setShowAddForm(false)} style={[styles.addCancelButton, { backgroundColor: colors.softBg, borderColor: colors.border }]}>
                <Text style={[styles.addCancelText, { color: colors.muted }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}

        {allergies.length > 0 ? (
          <View style={styles.allergyList}>
            {allergies.map((allergy) => (
              <View key={allergy} style={[styles.allergyItem, { backgroundColor: colors.softBg, borderColor: colors.border }]}> 
                <Text style={[styles.allergyLabel, { color: colors.text }]}>{allergy}</Text>
                <Pressable onPress={() => handleToggleAllergy(allergy)}>
                  <Feather name="x" size={20} color="#ef4444" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.softBg, borderColor: colors.border }]}> 
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>No allergies yet. Add one to get started!</Text>
          </View>
        )}
      </Card>

      <Card style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sensitivity: {sensitivityLabel}</Text>
        <View style={styles.sensitivityWrap}>
          <View style={[styles.sensitivityTrack, { backgroundColor: colors.softBg, borderColor: colors.border }]}> 
            <View
              style={[
                styles.sensitivityPill,
                activeSensitivityIndex === 0 && styles.sensitivityPillLeft,
                activeSensitivityIndex === 1 && styles.sensitivityPillCenter,
                activeSensitivityIndex === 2 && styles.sensitivityPillRight,
              ]}
            />
            {sensitivityOptions.map((option, index) => {
              const isActive = index === activeSensitivityIndex
              return (
                <Pressable key={option} onPress={() => handleSensitivityChange(index)} style={styles.segmentButton}>
                  <Text style={[styles.segmentLabel, { color: colors.text }, isActive && styles.segmentLabelActive]}>{option}</Text>
                  {isActive ? <View style={styles.segmentDot} /> : null}
                </Pressable>
              )
            })}
          </View>
        </View>
        <Text style={[styles.meta, { color: colors.muted }]}>Use strict mode for trace-level allergen avoidance.</Text>
      </Card>

      <Card style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Issues</Text>
        {healthIssues.length > 0 ? (
          <View style={styles.healthIssuesWrap}>
            {healthIssues.map((issue) => (
              <Pressable key={issue} style={[styles.healthIssueChip, { backgroundColor: colors.softBg, borderColor: colors.border }]} onPress={() => handleToggleHealthIssue(issue)}>
                <Text style={[styles.healthIssueText, { color: colors.text }]}>{issue}</Text>
                <Feather name="x" size={16} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.softBg, borderColor: colors.border }]}> 
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>No health issues selected from intake.</Text>
          </View>
        )}
      </Card>

      <Card style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
        <TextInput
          multiline
          placeholder="Share your dining feedback"
          placeholderTextColor={colors.inputPlaceholder}
          style={[styles.reviewInput, { backgroundColor: colors.softBg, borderColor: colors.border, color: colors.text }]}
          value={reviewInput}
          onChangeText={setReviewInput}
        />
        <Pressable style={[styles.reviewButton, { backgroundColor: colors.accent }]} onPress={() => setReviewInput('')}>
          <Text style={styles.reviewButtonText}>Submit Review</Text>
        </Pressable>

        <View style={styles.reviewList}>
          {feedbackItems.slice(0, 3).map((item) => (
            <View key={item.id} style={[styles.reviewItem, { borderColor: colors.border, backgroundColor: colors.softBg }]}> 
              <View style={styles.reviewHead}>
                <Text style={[styles.reviewUser, { color: colors.text }]}>{item.user}</Text>
                <Text style={styles.reviewRating}>{item.rating}.0 / 5</Text>
              </View>
              <Text style={[styles.reviewText, { color: colors.muted }]}>{item.comment}</Text>
              <Text style={[styles.reviewDate, { color: colors.muted }]}>{item.date}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.footerHint}>
        <Feather name="shield" size={14} color={colors.muted} />
        <Text style={[styles.footerText, { color: colors.muted }]}>Personal preferences are applied across restaurant scanning and reviews.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 14,
    backgroundColor: '#eef2f8',
  },
  profileCard: {
    padding: 18,
    borderRadius: 30,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  profileTextWrap: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: '#1e2a3a',
  },
  meta: {
    color: '#6d798b',
    fontSize: 16,
    lineHeight: 21,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 28,
    gap: 14,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2a3a',
    flex: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allergyList: {
    gap: 10,
  },
  allergyItem: {
    minHeight: 58,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fefefe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#93a3b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  allergyLabel: {
    color: '#253247',
    fontSize: 18,
    fontWeight: '700',
  },
  addFormContainer: {
    paddingTop: 4,
    paddingBottom: 12,
    gap: 10,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#f8fafa',
    borderWidth: 1,
    borderColor: '#dde3ec',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2a3a',
  },
  addFormButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addSubmitButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#27c06f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSubmitText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  addCancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCancelText: {
    color: '#6d798b',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#f8fbfd',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8ecf3',
  },
  emptyStateText: {
    color: '#8b97ab',
    fontSize: 14,
    fontWeight: '500',
  },
  healthIssuesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthIssueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#edf4fb',
    borderWidth: 1,
    borderColor: '#dce7f3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  healthIssueText: {
    color: '#31445a',
    fontSize: 13,
    fontWeight: '600',
  },
  sensitivityWrap: {
    paddingTop: 2,
  },
  sensitivityTrack: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8edf5',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#93a3b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  sensitivityPill: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    width: '31%',
    backgroundColor: '#e9b13b',
    borderRadius: 16,
  },
  sensitivityPillLeft: {
    left: 8,
  },
  sensitivityPillCenter: {
    left: '34.5%',
  },
  sensitivityPillRight: {
    right: 8,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  segmentLabel: {
    color: '#283648',
    fontSize: 16,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: '#ffffff',
  },
  segmentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  reviewInput: {
    minHeight: 84,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dce4f0',
    backgroundColor: '#f8fbff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#1f2a3a',
    textAlignVertical: 'top',
  },
  reviewButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21344d',
  },
  reviewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewList: {
    marginTop: 14,
    gap: 10,
  },
  reviewItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3ebf5',
    backgroundColor: '#fcfdff',
    padding: 12,
    gap: 4,
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewUser: {
    color: '#1f2a3a',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewRating: {
    color: '#d08411',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewText: {
    color: '#516071',
    fontSize: 13,
    lineHeight: 18,
  },
  reviewDate: {
    color: '#8b97ab',
    fontSize: 12,
  },
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingTop: 2,
  },
  footerText: {
    flex: 1,
    color: '#7f8b9c',
    fontSize: 12,
    lineHeight: 16,
  },
})
