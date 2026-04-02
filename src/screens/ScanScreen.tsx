import { Feather } from '@expo/vector-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import type { UserIntakeProfile } from '../types'

type FoodItem = {
  id: string
  name: string
  image: string
  allergens: string[]
  healthConcerns: string[]
  description: string
}

type ScanResult = {
  status: 'safe' | 'unsafe' | 'uncertain'
  conflicts: string[]
}

const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Peanut Butter Sandwich',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=500&q=80',
    allergens: ['peanuts', 'gluten', 'dairy'],
    healthConcerns: ['high-cal', 'high-sugar'],
    description: 'White bread with creamy peanut butter and jelly',
  },
  {
    id: '2',
    name: 'Greek Yogurt Cup',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    allergens: ['milk'],
    healthConcerns: [],
    description: 'Greek yogurt with fruit puree',
  },
  {
    id: '3',
    name: 'Gluten Free Granola',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=500&q=80',
    allergens: ['tree nuts'],
    healthConcerns: [],
    description: 'Crunchy granola with nuts and seeds',
  },
  {
    id: '4',
    name: 'Shrimp Instant Noodles',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80',
    allergens: ['shellfish', 'wheat', 'soy'],
    healthConcerns: [],
    description: 'Cup noodles with shrimp flavoring',
  },
  {
    id: '5',
    name: 'Mixed Vegetable Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    allergens: [],
    healthConcerns: ['vegan', 'gluten-free'],
    description: 'Broccoli, carrots, bell peppers, and quinoa',
  },
]

const barcodeToFoodId: Record<string, string> = {
  '8901030895480': '1',
  '3017620422003': '2',
  '7622210449283': '3',
  '9556001122334': '4',
  '8999999999999': '5',
}

type ScanScreenProps = {
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
}

export function ScanScreen({ profile, theme }: ScanScreenProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [cameraOpen, setCameraOpen] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [lastBarcode, setLastBarcode] = useState('')
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null)
  const [searchText, setSearchText] = useState('')
  const [showResults, setShowResults] = useState(false)

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
      inputPlaceholder: isLight ? '#8a93a0' : '#9ca3af',
      resultBorder: isLight ? '#e2e8f0' : theme.border,
      cameraOverlay: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(2, 6, 23, 0.62)',
      cameraButtonBg: isLight ? 'rgba(15, 23, 42, 0.82)' : 'rgba(15, 23, 42, 0.75)',
    }
  }, [theme])

  const userAllergies = useMemo(() => profile?.allergies?.map((a) => a.trim().toLowerCase()) ?? [], [profile])

  const checkFoodSafety = (food: FoodItem): ScanResult => {
    const conflictingAllergens = food.allergens.filter((allergen) => {
      const normalizedAllergen = allergen.toLowerCase()
      return userAllergies.some((userAllergy) => {
        const normalizedUser = userAllergy.toLowerCase()
        return normalizedUser.includes(normalizedAllergen) || normalizedAllergen.includes(normalizedUser)
      })
    })

    if (conflictingAllergens.length > 0) {
      return { status: 'unsafe', conflicts: conflictingAllergens }
    }

    const potentialIssues = food.healthConcerns.filter((concern) =>
      profile?.healthIssues?.some((issue) => issue.toLowerCase().includes(concern.toLowerCase()))
    )

    if (potentialIssues.length > 0) {
      return { status: 'uncertain', conflicts: potentialIssues }
    }

    return { status: 'safe', conflicts: [] }
  }

  const handleScanFood = (food: FoodItem, barcode?: string) => {
    setScannedFood(food)
    setLastBarcode(barcode ?? '')
    setShowResults(true)
    setCameraOpen(false)
    setHasScanned(true)
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (hasScanned) return

    setHasScanned(true)
    const foodId = barcodeToFoodId[data]
    const matched = foodDatabase.find((item) => item.id === foodId)

    if (matched) {
      handleScanFood(matched, data)
      return
    }

    setLastBarcode(data)
    setScannedFood({
      id: 'unknown',
      name: 'Unknown Product',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
      allergens: [],
      healthConcerns: ['unknown ingredients'],
      description: 'Barcode scanned but this product is not in our local database yet.',
    })
    setShowResults(true)
    setCameraOpen(false)
  }

  const openCameraScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) return
    }

    setHasScanned(false)
    setCameraOpen(true)
  }

  const resetScan = () => {
    setShowResults(false)
    setScannedFood(null)
    setSearchText('')
    setLastBarcode('')
    setHasScanned(false)
  }

  const handleSearchScan = () => {
    const found = foodDatabase.find((f) => f.name.toLowerCase().includes(searchText.toLowerCase()))
    if (found) handleScanFood(found)
  }

  if (cameraOpen) {
    return (
      <View style={[styles.cameraScreen, { backgroundColor: colors.pageBg }]}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'itf14'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        <View style={[styles.cameraOverlay, { backgroundColor: colors.cameraOverlay }]}>
          <View style={[styles.scanFrame, { borderColor: colors.text }]} />
          <Text style={[styles.cameraHint, { color: colors.text }]}>Align the product barcode inside the box</Text>

          <View style={styles.cameraActions}>
            <Pressable style={[styles.cameraActionBtn, { backgroundColor: colors.cameraButtonBg }]} onPress={() => setCameraOpen(false)}>
              <Feather name="x" size={18} color="#ffffff" />
              <Text style={styles.cameraActionText}>Close</Text>
            </Pressable>
            <Pressable style={[styles.cameraActionBtn, { backgroundColor: colors.cameraButtonBg }]} onPress={() => setHasScanned(false)}>
              <Feather name="refresh-cw" size={18} color="#ffffff" />
              <Text style={styles.cameraActionText}>Rescan</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  if (showResults && scannedFood) {
    const safetyCheck = checkFoodSafety(scannedFood)
    const isSafe = safetyCheck.status === 'safe'
    const isUnsafe = safetyCheck.status === 'unsafe'

    return (
      <ScrollView contentContainerStyle={[styles.resultContainer, { backgroundColor: colors.pageBg }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultCard, { backgroundColor: colors.cardBg, borderColor: colors.resultBorder }]}>
          <Image source={{ uri: scannedFood.image }} style={styles.resultImage} />

          <View style={styles.resultHeader}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>{scannedFood.name}</Text>
            <View
              style={[
                styles.statusBadge,
                isSafe && styles.statusSafe,
                isUnsafe && styles.statusUnsafe,
                safetyCheck.status === 'uncertain' && styles.statusUncertain,
              ]}
            >
              <Feather name={isSafe ? 'check-circle' : isUnsafe ? 'x-circle' : 'alert-circle'} size={14} color={isSafe || isUnsafe ? '#fff' : '#1f2937'} />
              <Text style={[styles.statusText, isSafe && styles.statusTextSafe, isUnsafe && styles.statusTextUnsafe, safetyCheck.status === 'uncertain' && styles.statusTextUncertain]}>
                {isSafe ? 'SAFE' : isUnsafe ? 'UNSAFE' : 'UNCERTAIN'}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.muted }]}>{scannedFood.description}</Text>
          {!!lastBarcode && <Text style={[styles.barcodeText, { color: colors.text }]}>Barcode: {lastBarcode}</Text>}

          {safetyCheck.conflicts.length > 0 && (
            <View style={[styles.conflictBox, isUnsafe ? styles.conflictBoxUnsafe : styles.conflictBoxUncertain]}>
              <Text style={[styles.conflictTitle, { color: colors.text }]}>{isUnsafe ? 'Allergens Found:' : 'Potential Issues:'}</Text>
              {safetyCheck.conflicts.map((conflict) => (
                <Text key={conflict} style={[styles.conflictItem, { color: colors.muted }]}>- {conflict}</Text>
              ))}
            </View>
          )}

          <Pressable style={[styles.scanAgainButton, { backgroundColor: colors.accent }]} onPress={openCameraScanner}>
            <Feather name="camera" size={16} color="#ffffff" />
            <Text style={styles.scanAgainButtonText}>Scan Next Item</Text>
          </Pressable>

          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={resetScan}>
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Back To Scan List</Text>
          </Pressable>
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Feather name="camera" size={32} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Scan Food Item</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Scan product barcode and check if it is safe for your profile</Text>
        </View>

        <Pressable style={[styles.primaryScanBtn, { backgroundColor: colors.accent }]} onPress={openCameraScanner}>
          <Feather name="camera" size={18} color="#ffffff" />
          <Text style={styles.primaryScanText}>Open Camera Scanner</Text>
        </Pressable>

        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Feather name="search" size={16} color={colors.accent} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search food by name"
              placeholderTextColor={colors.inputPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <Pressable style={[styles.searchButton, { backgroundColor: colors.accent }]} onPress={handleSearchScan} disabled={!searchText}>
            <Feather name="arrow-right" size={16} color="#ffffff" />
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Sample Items</Text>
        <View style={styles.foodGrid}>
          {foodDatabase.map((food) => {
            const safety = checkFoodSafety(food)
            const color = safety.status === 'safe' ? '#22c55e' : safety.status === 'unsafe' ? '#ef4444' : '#eab308'

            return (
              <Pressable key={food.id} style={[styles.foodCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleScanFood(food)}>
                <Image source={{ uri: food.image }} style={styles.foodImage} />
                <View style={[styles.safetyIndicator, { backgroundColor: color }]}>
                  <Feather name={safety.status === 'safe' ? 'check' : safety.status === 'unsafe' ? 'x' : 'alert-circle'} size={12} color="#fff" />
                </View>
                <Text style={[styles.foodName, { color: colors.text }]}>{food.name}</Text>
                <Text style={[styles.foodStatus, { color: colors.muted }]}>{safety.status.toUpperCase()}</Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 62, paddingBottom: 130, gap: 16 },
  header: { alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  primaryScanBtn: {
    backgroundColor: '#fb5b24', borderRadius: 12, paddingVertical: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  primaryScanText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  searchSection: { flexDirection: 'row', gap: 8 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1,
    borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: '#fff',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  searchButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fb5b24', alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  foodCard: { width: '48%', borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', paddingBottom: 10 },
  foodImage: { width: '100%', height: 110 },
  safetyIndicator: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  foodName: { fontSize: 12, fontWeight: '600', color: '#0f172a', paddingHorizontal: 8, paddingTop: 6 },
  foodStatus: { fontSize: 11, color: '#64748b', paddingHorizontal: 8, paddingTop: 2 },

  cameraScreen: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: '80%', height: 220, borderWidth: 2, borderRadius: 16, borderColor: '#fff', borderStyle: 'dashed' },
  cameraHint: { marginTop: 14, color: '#fff', fontWeight: '600' },
  cameraActions: { position: 'absolute', bottom: 56, flexDirection: 'row', gap: 12 },
  cameraActionBtn: {
    flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.75)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
  },
  cameraActionText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  resultContainer: { paddingHorizontal: 16, paddingTop: 62, paddingBottom: 130, backgroundColor: '#f8fafc' },
  resultCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  resultImage: { width: '100%', height: 240 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  resultTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a', flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  statusSafe: { backgroundColor: '#22c55e' },
  statusUnsafe: { backgroundColor: '#ef4444' },
  statusUncertain: { backgroundColor: '#eab308' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextSafe: { color: '#fff' },
  statusTextUnsafe: { color: '#fff' },
  statusTextUncertain: { color: '#1f2937' },
  description: { fontSize: 13, color: '#64748b', paddingHorizontal: 16 },
  barcodeText: { fontSize: 12, color: '#334155', paddingHorizontal: 16, fontWeight: '600' },
  conflictBox: { marginHorizontal: 16, borderRadius: 12, padding: 12, gap: 6, borderWidth: 1 },
  conflictBoxUnsafe: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  conflictBoxUncertain: { backgroundColor: '#fefce8', borderColor: '#fef08a' },
  conflictTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  conflictItem: { fontSize: 12, color: '#475569' },
  scanAgainButton: {
    marginHorizontal: 16, marginTop: 4, paddingVertical: 12, flexDirection: 'row', gap: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fb5b24', borderRadius: 12,
  },
  scanAgainButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  secondaryButton: { marginHorizontal: 16, marginBottom: 14, paddingVertical: 11, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1' },
  secondaryButtonText: { color: '#334155', fontWeight: '600' },
})
