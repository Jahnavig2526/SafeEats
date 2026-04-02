import { Feather } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useEffect, useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { restaurants } from '../data/mockData'
import { calculateDistance, formatDistance } from '../lib/geolocation'

const restaurantItems = [
  {
    id: '1',
    name: 'Osteria Francescana',
    rating: 4.8,
    address: '2727 Indian Creek Dr, Miami Beach, FL...',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Yardbird Table & Bar',
    rating: 4.5,
    address: '1600 Lenox Ave., Miami Beach, FL 33139',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '3',
    name: 'Bodega Taqueria y Tequila',
    rating: 4.8,
    address: '1220 16th St, Miami Beach, FL 33139',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'Broken Shaker at Freehand...',
    rating: 4.3,
    address: '2727 Indian Creek Dr, Miami Beach, FL...',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '5',
    name: 'MILA Restaurant',
    rating: 4.5,
    address: '1636 Meridian Ave Rooftop, Miami Bea...',
    image:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=500&q=80',
  },
]

const categoryFilters = ['Fast food', 'European', 'Italian', 'Mexican', 'Japanese', 'French']

type RestaurantScreenProps = {
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

export function RestaurantScreen({ theme }: RestaurantScreenProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const activeCategory = 'Italian'
  const activeRatings = [3, 4]

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
      overlay: isLight ? 'rgba(17, 24, 39, 0.38)' : 'rgba(2, 6, 23, 0.62)',
    }
  }, [theme])

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocationError('Location permission denied. Showing closest known places.')
          setUserLocation({ latitude: 40.7505, longitude: -73.9972 })
          return
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      } catch {
        setLocationError('Unable to read location. Showing closest known places.')
        setUserLocation({ latitude: 40.7505, longitude: -73.9972 })
      }
    }

    requestLocation()
  }, [])

  const nearbyRestaurants = useMemo(() => {
    if (!userLocation) {
      return []
    }

    return restaurants
      .map((restaurant) => ({
        ...restaurant,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          restaurant.latitude,
          restaurant.longitude
        ),
      }))
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
      .slice(0, 5)
  }, [userLocation])

  return (
    <View style={[styles.screen, { backgroundColor: colors.pageBg }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.pageBg }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
            <Feather name="chevron-left" size={18} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>List of restaurants</Text>
          <Pressable style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
            <Feather name="heart" size={17} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
            <Feather name="search" size={18} color={colors.accent} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Restaurant name or dish..."
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>
          <Pressable style={[styles.filterButton, { backgroundColor: colors.accent }]} onPress={() => setIsFilterOpen(true)}>
            <Feather name="sliders" size={16} color="#ffffff" />
          </Pressable>
        </View>

        {restaurantItems.map((item) => (
          <View key={item.id} style={[styles.itemCard, { borderColor: colors.border, backgroundColor: colors.cardBg }]}> 
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemBody}>
              <View style={styles.itemTopRow}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.ratingWrap}>
                  <Feather name="star" size={13} color="#f59e0b" />
                  <Text style={[styles.ratingText, { color: colors.muted }]}>{item.rating}</Text>
                </View>
              </View>
              <View style={styles.addressRow}>
                <Feather name="map-pin" size={11} color={colors.accent} />
                <Text style={[styles.itemAddress, { color: colors.muted }]}>{item.address}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.bottomSection}>
          <Text style={[styles.bottomSectionTitle, { color: colors.text }]}>Nearby Restaurants</Text>
          {locationError ? <Text style={[styles.locationHint, { color: colors.accent }]}>{locationError}</Text> : null}

          {nearbyRestaurants.length > 0 ? (
            nearbyRestaurants.map((restaurant) => (
              <View key={`nearby-${restaurant.id}`} style={[styles.nearbyCard, { borderColor: colors.border, backgroundColor: colors.cardBg }]}> 
                <Image source={{ uri: restaurant.image }} style={styles.nearbyImage} />
                <View style={styles.nearbyBody}>
                  <Text style={[styles.nearbyName, { color: colors.text }]}>{restaurant.name}</Text>
                  <Text style={[styles.nearbyAddress, { color: colors.muted }]} numberOfLines={1}>
                    {restaurant.address}
                  </Text>
                </View>
                <View style={[styles.nearbyDistanceBadge, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
                  <Text style={[styles.nearbyDistanceText, { color: colors.accent }]}>{restaurant.distance !== undefined ? formatDistance(restaurant.distance) : 'Near'}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.locationHint, { color: colors.muted }]}>Detecting location for nearby restaurants...</Text>
          )}
        </View>
      </ScrollView>

      {isFilterOpen && (
        <View style={[styles.filterOverlay, { backgroundColor: colors.overlay }]}>
          <Pressable style={styles.overlayDismissArea} onPress={() => setIsFilterOpen(false)} />
          <View style={[styles.filterSheet, { backgroundColor: colors.cardBg }]}> 
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

            <View style={styles.filterHeader}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Filter</Text>
              <Pressable onPress={() => setIsFilterOpen(false)}>
                <Text style={[styles.resetText, { color: colors.muted }]}>Reset</Text>
              </Pressable>
            </View>

            <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Categories</Text>
            <View style={styles.filterChips}>
              {categoryFilters.map((category) => {
                const isActive = category === activeCategory
                return (
                  <View key={category} style={[styles.filterChip, { borderColor: colors.border, backgroundColor: colors.softBg }, isActive && [styles.filterChipActive, { backgroundColor: colors.accent, borderColor: colors.accent }]]}>
                    <Text style={[styles.filterChipText, { color: colors.text }, isActive && styles.filterChipTextActive]}>{category}</Text>
                  </View>
                )
              })}
            </View>

            <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

            <View style={styles.distanceTitleRow}>
              <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Distance to me</Text>
              <View style={styles.distanceControls}>
                <View style={[styles.stepButton, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
                  <Feather name="minus" size={14} color={colors.muted} />
                </View>
                <Text style={[styles.distanceValue, { color: colors.accent }]}>2 km</Text>
                <View style={[styles.stepButton, { borderColor: colors.border, backgroundColor: colors.softBg }]}>
                  <Feather name="plus" size={14} color={colors.muted} />
                </View>
              </View>
            </View>

            <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

            <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Rating</Text>
            <View style={styles.ratingChips}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = activeRatings.includes(value)
                return (
                  <View key={value} style={[styles.ratingChip, { borderColor: colors.border, backgroundColor: colors.softBg }, isActive && [styles.ratingChipActive, { backgroundColor: colors.accent, borderColor: colors.accent }]]}>
                    <Text style={[styles.ratingChipText, { color: colors.text }, isActive && styles.ratingChipTextActive]}>{value}</Text>
                    <Feather name="star" size={10} color={isActive ? '#ffffff' : '#f59e0b'} />
                  </View>
                )
              })}
            </View>

            <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

            <View style={styles.priceHeader}>
              <Text style={[styles.filterSectionLabel, { color: colors.text }]}>Price</Text>
              <Text style={[styles.priceRange, { color: colors.accent }]}>$70-$125</Text>
            </View>

            <View style={styles.sliderWrap}>
              <View style={styles.sliderTrack} />
              <View style={styles.sliderRange} />
              <View style={[styles.sliderKnob, styles.sliderKnobLeft]} />
              <View style={[styles.sliderKnob, styles.sliderKnobRight]} />
            </View>

            <Pressable style={styles.resultsButton} onPress={() => setIsFilterOpen(false)}>
              <Text style={styles.resultsButtonText}>Show results</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    paddingHorizontal: 14,
    paddingTop: 52,
    paddingBottom: 130,
    gap: 10,
    backgroundColor: '#f3f4f6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#f9fafb',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#fb5b24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    padding: 9,
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemName: {
    flex: 1,
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: '#6b7280',
    fontSize: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  itemAddress: {
    color: '#9ca3af',
    fontSize: 10,
    flex: 1,
  },
  bottomSection: {
    marginTop: 10,
    gap: 8,
  },
  bottomSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  locationHint: {
    color: '#b45309',
    fontSize: 12,
    marginBottom: 2,
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    padding: 9,
  },
  nearbyImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  nearbyBody: {
    flex: 1,
    gap: 4,
  },
  nearbyName: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  nearbyAddress: {
    color: '#9ca3af',
    fontSize: 10,
  },
  nearbyDistanceBadge: {
    borderRadius: 999,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  nearbyDistanceText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.38)',
    justifyContent: 'flex-end',
  },
  overlayDismissArea: {
    flex: 1,
  },
  filterSheet: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
  },
  sheetHandle: {
    width: 32,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#eceff3',
    alignSelf: 'center',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTitle: {
    fontSize: 33,
    fontWeight: '700',
    color: '#111827',
  },
  resetText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  filterSectionLabel: {
    fontSize: 31,
    fontWeight: '600',
    color: '#111827',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    minWidth: 94,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: '#fb5b24',
    borderColor: '#fb5b24',
  },
  filterChipText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#eceff3',
  },
  distanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distanceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eceff3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  distanceValue: {
    minWidth: 38,
    textAlign: 'center',
    fontSize: 14,
    color: '#fb5b24',
    fontWeight: '500',
  },
  ratingChips: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  ratingChipActive: {
    backgroundColor: '#fb5b24',
    borderColor: '#fb5b24',
  },
  ratingChipText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  ratingChipTextActive: {
    color: '#ffffff',
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRange: {
    fontSize: 12,
    color: '#fb5b24',
    fontWeight: '500',
  },
  sliderWrap: {
    height: 24,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 2,
    borderRadius: 999,
    backgroundColor: '#eceff3',
  },
  sliderRange: {
    position: 'absolute',
    left: '16%',
    right: '50%',
    height: 3,
    borderRadius: 999,
    backgroundColor: '#fb5b24',
  },
  sliderKnob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fb5b24',
  },
  sliderKnobLeft: {
    left: '16%',
    marginLeft: -9,
  },
  sliderKnobRight: {
    right: '50%',
    marginRight: -9,
  },
  resultsButton: {
    marginTop: 8,
    backgroundColor: '#fb5b24',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  resultsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
})
