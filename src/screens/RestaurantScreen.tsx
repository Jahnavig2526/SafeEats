import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

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

export function RestaurantScreen() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const activeCategory = 'Italian'
  const activeRatings = [3, 4]

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconButton}>
            <Feather name="chevron-left" size={18} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>List of restaurants</Text>
          <Pressable style={styles.iconButton}>
            <Feather name="heart" size={17} color="#1f2937" />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#fb5b24" />
            <TextInput
              style={styles.searchInput}
              placeholder="Restaurant name or dish..."
              placeholderTextColor="#9ca3af"
            />
          </View>
          <Pressable style={styles.filterButton} onPress={() => setIsFilterOpen(true)}>
            <Feather name="sliders" size={16} color="#ffffff" />
          </Pressable>
        </View>

        {restaurantItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemBody}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.ratingWrap}>
                  <Feather name="star" size={13} color="#f59e0b" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <View style={styles.addressRow}>
                <Feather name="map-pin" size={11} color="#fb5b24" />
                <Text style={styles.itemAddress}>{item.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {isFilterOpen && (
        <View style={styles.filterOverlay}>
          <Pressable style={styles.overlayDismissArea} onPress={() => setIsFilterOpen(false)} />
          <View style={styles.filterSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter</Text>
              <Pressable onPress={() => setIsFilterOpen(false)}>
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
            </View>

            <Text style={styles.filterSectionLabel}>Categories</Text>
            <View style={styles.filterChips}>
              {categoryFilters.map((category) => {
                const isActive = category === activeCategory
                return (
                  <View key={category} style={[styles.filterChip, isActive && styles.filterChipActive]}>
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{category}</Text>
                  </View>
                )
              })}
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.distanceTitleRow}>
              <Text style={styles.filterSectionLabel}>Distance to me</Text>
              <View style={styles.distanceControls}>
                <View style={styles.stepButton}>
                  <Feather name="minus" size={14} color="#9ca3af" />
                </View>
                <Text style={styles.distanceValue}>2 km</Text>
                <View style={styles.stepButton}>
                  <Feather name="plus" size={14} color="#9ca3af" />
                </View>
              </View>
            </View>

            <View style={styles.sectionDivider} />

            <Text style={styles.filterSectionLabel}>Rating</Text>
            <View style={styles.ratingChips}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = activeRatings.includes(value)
                return (
                  <View key={value} style={[styles.ratingChip, isActive && styles.ratingChipActive]}>
                    <Text style={[styles.ratingChipText, isActive && styles.ratingChipTextActive]}>{value}</Text>
                    <Feather name="star" size={10} color={isActive ? '#ffffff' : '#f59e0b'} />
                  </View>
                )
              })}
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.priceHeader}>
              <Text style={styles.filterSectionLabel}>Price</Text>
              <Text style={styles.priceRange}>$70-$125</Text>
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
