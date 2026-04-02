import { Feather } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useEffect, useMemo, useState } from 'react'
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { restaurants, menuItems } from '../data/mockData'
import { calculateDistance, formatDistance } from '../lib/geolocation'
import type { Restaurant } from '../types'

const categories = ['All', 'Vegan', 'Drinks', 'Healthy food', 'Italian', 'Asian']

export function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<Array<{ itemId: string; name: string; price: string; quantity: number }>>([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [maxDistance, setMaxDistance] = useState(15) // in kilometers
  const [locationError, setLocationError] = useState<string | null>(null)

  // Request location permission and get user location on mount
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocationError('Location permission denied')
          // Use default location (NYC) for demo
          setUserLocation({ latitude: 40.7505, longitude: -73.9972 })
          return
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      } catch (error) {
        console.error('Error getting location:', error)
        // Use default location for demo
        setUserLocation({ latitude: 40.7505, longitude: -73.9972 })
      }
    }

    requestLocation()
  }, [])

  // Calculate distances and add them to restaurants
  const restaurantsWithDistance = useMemo(() => {
    if (!userLocation) return restaurants

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
  }, [userLocation])

  // Filter dishes based on search and category
  const filteredDishes = useMemo(() => {
    let filtered = menuItems

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => {
        const tags = [item.name, item.description].join(' ').toLowerCase()
        return tags.includes(selectedCategory.toLowerCase())
      })
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Filter restaurants based on search, rating, and distance
  const filteredRestaurants = useMemo(() => {
    let filtered: Restaurant[] = restaurantsWithDistance

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(query) || r.address.toLowerCase().includes(query))
    }

    if (minRating > 0) {
      filtered = filtered.filter((r) => r.rating >= minRating)
    }

    // Filter by distance
    filtered = filtered.filter((r) => (r.distance ?? Infinity) <= maxDistance)

    return filtered
  }, [searchQuery, minRating])

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const addToCart = (itemId: string, name: string, price: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.itemId === itemId)
      if (existing) {
        return prev.map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { itemId, name, price, quantity: 1 }]
    })
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''))
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topRow}>
          <Feather name="menu" size={22} color="#f8fafc" />
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>🍽️</Text>
          </View>
        </View>

        {/* Hero Title */}
        <Text style={styles.heroTitle}>
          Find Your <Text style={styles.heroTitleBold}>Best</Text>{'\n'}
          <Text style={styles.heroTitleBold}>Food</Text> Around You
        </Text>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#d4d4d8" />
          <TextInput
            placeholder="Search restaurants or dishes"
            placeholderTextColor="#737373"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable onPress={() => setShowFilterModal(true)}>
            <Feather name="sliders" size={16} color="#f8fafc" />
          </Pressable>
        </View>

        {/* Promo Card */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoHeadline}>20% Discount 🔥</Text>
            <Text style={styles.promoSubhead}>On your first order</Text>
            <View style={styles.promoMetaRow}>
              <Text style={styles.promoMeta}>Limited time</Text>
              <Text style={styles.promoMeta}>☆ 4.5</Text>
            </View>
            <Pressable style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Claim Now</Text>
            </Pressable>
          </View>
          <View style={styles.promoImageWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' }}
              style={styles.promoImage}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.seeAll}>All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.chipsRow}>
            {categories.map((chip) => {
              const isActive = chip === selectedCategory
              return (
                <Pressable
                  key={chip}
                  onPress={() => setSelectedCategory(chip)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip}</Text>
                </Pressable>
              )
            })}
          </View>
        </ScrollView>

        {/* Restaurants Section */}
        {filteredRestaurants.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Restaurants</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.restaurantRow}>
                {filteredRestaurants.slice(0, 3).map((restaurant) => {
                  const isFav = favorites.includes(restaurant.id)
                  return (
                    <View key={restaurant.id} style={styles.restaurantCard}>
                      <View style={styles.restaurantImageWrap}>
                        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                        <Pressable
                          onPress={() => toggleFavorite(restaurant.id)}
                          style={styles.restaurantHeartBtn}
                        >
                          <Feather name={isFav ? 'heart' : 'heart'} size={16} color={isFav ? '#ef4444' : '#e8d17a'} fill={isFav ? '#ef4444' : 'none'} />
                        </Pressable>
                      </View>
                      <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <View style={styles.restaurantMeta}>
                          <Feather name="star" size={12} color="#f59e0b" />
                          <Text style={styles.restaurantRating}>{restaurant.rating}</Text>
                          <Text style={styles.restaurantTag}>{restaurant.safeTag}</Text>
                        </View>
                        {restaurant.distance !== undefined && (
                          <View style={styles.restaurantDistance}>
                            <Feather name="map-pin" size={11} color="#8f95a3" />
                            <Text style={styles.restaurantDistanceText}>{formatDistance(restaurant.distance)}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </>
        )}

        {/* Menu Items / Dishes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Results' : 'Popular Dishes'}
          </Text>
          <Text style={styles.itemCount}>{filteredDishes.length}</Text>
        </View>

        {filteredDishes.length > 0 ? (
          <View style={styles.dishesGrid}>
            {filteredDishes.map((item) => {
              const isFav = favorites.includes(item.id)
              const statusColors = {
                safe: { bg: '#dcfce7', text: '#22c55e', icon: '✓' },
                unsafe: { bg: '#fee2e2', text: '#ef4444', icon: '✕' },
                uncertain: { bg: '#fef9c3', text: '#a16207', icon: '?' },
              }
              const colors = statusColors[item.status]

              return (
                <View key={item.id} style={styles.dishCard}>
                  <View style={styles.dishImageWrap}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }} style={styles.dishImage} />
                    <View style={[styles.safetyBadge, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.safetyText, { color: colors.text }]}>{colors.icon}</Text>
                    </View>
                  </View>

                  <View style={styles.dishContent}>
                    <Text style={styles.dishName}>{item.name}</Text>
                    <Text style={styles.dishDescription} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={styles.dishFooter}>
                      <Pressable onPress={() => toggleFavorite(item.id)} style={styles.dishHeartBtn}>
                        <Feather name="heart" size={14} color={isFav ? '#ef4444' : '#e8d17a'} fill={isFav ? '#ef4444' : 'none'} />
                      </Pressable>
                      <Pressable onPress={() => addToCart(item.id, item.name, '$12.00')} style={styles.dishAddBtn}>
                        <Feather name="plus" size={14} color="#0f1117" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="search" size={48} color="#8f95a3" />
            <Text style={styles.emptyStateText}>No items found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your filters or search query</Text>
          </View>
        )}

        {/* Favorites Panel */}
        {favorites.length > 0 && (
          <View style={styles.favoritesPanel}>
            <View style={styles.favoritesPanelHeader}>
              <Feather name="heart" size={16} color="#ef4444" fill="#ef4444" />
              <Text style={styles.favoritesPanelTitle}>Saved {favorites.length} items</Text>
            </View>
            <Text style={styles.favoritesPanelSubtext}>Items you've liked are saved here</Text>
          </View>
        )}
      </ScrollView>

      {/* Cart Floating Button */}
      {totalItems > 0 && (
        <View style={styles.cartFloating}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{totalItems} items</Text>
            <Text style={styles.cartPrice}>${cartTotal.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.cartCheckout}>
            <Text style={styles.cartCheckoutText}>Checkout</Text>
          </Pressable>
        </View>
      )}

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.filterOverlay}>
          <Pressable style={styles.filterDismiss} onPress={() => setShowFilterModal(false)} />
          <View style={styles.filterContent}>
            <View style={styles.filterHandle} />

            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <Pressable onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color="#1f2a3a" />
              </Pressable>
            </View>

            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.ratingFilter}>
              {[0, 3, 3.5, 4, 4.5, 5].map((rating) => (
                <Pressable
                  key={rating}
                  onPress={() => setMinRating(rating)}
                  style={[styles.ratingOption, minRating === rating && styles.ratingOptionActive]}
                >
                  <Text style={[styles.ratingOptionText, minRating === rating && styles.ratingOptionTextActive]}>
                    {rating === 0 ? 'All' : `${rating}+`}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.distanceSection}>
              <View style={styles.distanceHeader}>
                <Text style={styles.filterLabel}>Maximum Distance</Text>
                <Text style={styles.distanceValue}>{maxDistance} km</Text>
              </View>
              <View style={styles.distanceOptions}>
                {[5, 10, 15, 20, 30].map((distance) => (
                  <Pressable
                    key={distance}
                    onPress={() => setMaxDistance(distance)}
                    style={[styles.distanceOption, maxDistance === distance && styles.distanceOptionActive]}
                  >
                    <Text style={[styles.distanceOptionText, maxDistance === distance && styles.distanceOptionTextActive]}>
                      {distance}km
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable style={styles.filterApplyBtn} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.filterApplyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 180,
    gap: 16,
    backgroundColor: '#181a1f',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#23252b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 41,
    lineHeight: 49,
    fontWeight: '400',
  },
  heroTitleBold: {
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#26282f',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#f8fafc',
  },
  promoCard: {
    backgroundColor: '#23252b',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoContent: {
    flex: 1,
    gap: 8,
  },
  promoHeadline: {
    color: '#f3de85',
    fontSize: 26,
    fontWeight: '800',
  },
  promoSubhead: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  promoMetaRow: {
    flexDirection: 'row',
    gap: 14,
  },
  promoMeta: {
    color: '#9ca3af',
    fontSize: 12,
  },
  promoButton: {
    backgroundColor: '#f3de85',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  promoButtonText: {
    color: '#0f1117',
    fontWeight: '600',
    fontSize: 12,
  },
  promoImageWrap: {
    width: 100,
    alignItems: 'center',
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
  },
  seeAll: {
    color: '#f3de85',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCount: {
    color: '#8f95a3',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#2a2c33',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: '#f3de85',
  },
  chipText: {
    color: '#eceff3',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#0f1117',
  },
  restaurantRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  restaurantCard: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#23252b',
  },
  restaurantImageWrap: {
    height: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1f2127',
    borderWidth: 1,
    borderColor: '#8d8252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantInfo: {
    padding: 12,
    gap: 4,
  },
  restaurantName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantRating: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantTag: {
    color: '#27c06f',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  dishesGrid: {
    gap: 12,
  },
  dishCard: {
    backgroundColor: '#23252b',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  dishImageWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  safetyBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyText: {
    fontWeight: '700',
    fontSize: 12,
  },
  dishContent: {
    flex: 1,
    gap: 6,
    justifyContent: 'space-between',
  },
  dishName: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 15,
  },
  dishDescription: {
    color: '#8f95a3',
    fontSize: 12,
    lineHeight: 16,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishHeartBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1f2127',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f3de85',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyStateSubtext: {
    color: '#8f95a3',
    fontSize: 14,
  },
  cartFloating: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#27c06f',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cartInfo: {
    gap: 4,
  },
  cartItemCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cartPrice: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cartCheckout: {
    backgroundColor: '#1e8e4e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cartCheckoutText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  favoritesPanel: {
    backgroundColor: '#2a2c33',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    gap: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  favoritesPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoritesPanelTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 14,
  },
  favoritesPanelSubtext: {
    color: '#8f95a3',
    fontSize: 12,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterDismiss: {
    flex: 1,
  },
  filterContent: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    gap: 20,
  },
  filterHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2a3a',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2a3a',
  },
  ratingFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#e8ecf3',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingOptionActive: {
    backgroundColor: '#f3de85',
    borderColor: '#e9b13b',
  },
  ratingOptionText: {
    color: '#6d798b',
    fontWeight: '600',
    fontSize: 13,
  },
  ratingOptionTextActive: {
    color: '#0f1117',
  },
  distanceSection: {
    gap: 12,
  },
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceValue: {
    color: '#27c06f',
    fontWeight: '700',
    fontSize: 16,
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#e8ecf3',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  distanceOptionActive: {
    backgroundColor: '#c6f6d5',
    borderColor: '#27c06f',
  },
  distanceOptionText: {
    color: '#6d798b',
    fontWeight: '600',
    fontSize: 13,
  },
  distanceOptionTextActive: {
    color: '#22863a',
  },
  restaurantDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  restaurantDistanceText: {
    color: '#8f95a3',
    fontSize: 12,
    fontWeight: '500',
  },
  filterApplyBtn: {
    backgroundColor: '#27c06f',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  filterApplyText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
})

