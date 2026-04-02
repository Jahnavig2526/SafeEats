import { Feather } from '@expo/vector-icons'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

const categories = ['Vegan', 'Drinks', 'Healty food']

const dishes = [
  {
    id: '1',
    name: 'Seafood salad',
    time: '20min',
    rating: 4.5,
    price: '$12.00',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Avocada salad',
    time: '20min',
    rating: 4.5,
    price: '$12.00',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
  },
]

export function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <Feather name="menu" size={22} color="#f8fafc" />
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>👨🏻‍🍳</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>
        Find Your <Text style={styles.heroTitleBold}>Best</Text>{'\n'}
        <Text style={styles.heroTitleBold}>Food</Text> Around You
      </Text>

      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#d4d4d8" />
        <TextInput placeholder="Search your favourit food" placeholderTextColor="#737373" style={styles.input} />
        <Feather name="sliders" size={16} color="#f8fafc" />
      </View>

      <View style={styles.promoCard}>
        <View style={styles.promoContent}>
          <Text style={styles.promoHeadline}>20% Discount 🔥</Text>
          <Text style={styles.promoSubhead}>in 2 orders in a iteams</Text>
          <View style={styles.promoMetaRow}>
            <Text style={styles.promoMeta}>20min</Text>
            <Text style={styles.promoMeta}>☆ 4.5</Text>
          </View>
          <Text style={styles.promoPrice}>$12.00</Text>
        </View>
        <View style={styles.promoImageWrap}>
          <Pressable style={styles.heartBtn}>
            <Feather name="heart" size={14} color="#e8d17a" />
          </Pressable>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' }}
            style={styles.promoImage}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catagories</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <View style={styles.chipsRow}>
        {categories.map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.gridRow}>
        {dishes.map((item) => (
          <View key={item.id} style={styles.dishCard}>
            <View style={styles.dishImageWrap}>
              <Image source={{ uri: item.image }} style={styles.dishImage} />
              <Pressable style={styles.smallHeartBtn}>
                <Feather name="heart" size={13} color="#e8d17a" />
              </Pressable>
            </View>

            <Text style={styles.dishName}>{item.name}🔥</Text>
            <View style={styles.dishMetaRow}>
              <Text style={styles.dishMeta}>{item.time}</Text>
              <Text style={styles.dishMeta}>☆ {item.rating}</Text>
            </View>
            <View style={styles.dishBottomRow}>
              <Text style={styles.dishPrice}>{item.price}</Text>
              <Pressable style={styles.addBtn}>
                <Feather name="plus" size={13} color="#0f1117" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 120,
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
    fontSize: 20,
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
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoContent: {
    flex: 1,
    gap: 4,
  },
  promoHeadline: {
    color: '#f3de85',
    fontSize: 27,
    fontWeight: '800',
  },
  promoSubhead: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 27,
  },
  promoMetaRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 4,
  },
  promoMeta: {
    color: '#9ca3af',
    fontSize: 12,
  },
  promoPrice: {
    color: '#f8fafc',
    marginTop: 2,
    fontSize: 24,
    fontWeight: '700',
  },
  promoImageWrap: {
    width: 125,
    alignItems: 'flex-end',
    gap: 6,
  },
  heartBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8d8252',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2127',
  },
  promoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f8fafc',
  },
  seeAll: {
    color: '#f3de85',
    fontSize: 15,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#2a2c33',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  chipText: {
    color: '#eceff3',
    fontSize: 14,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  dishCard: {
    flex: 1,
    backgroundColor: '#23252b',
    borderRadius: 16,
    padding: 10,
    gap: 6,
  },
  dishImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 102,
    position: 'relative',
  },
  dishImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  smallHeartBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#8d8252',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2127',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  dishName: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 17,
  },
  dishMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dishMeta: {
    color: '#8f95a3',
    fontSize: 12,
  },
  dishBottomRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dishPrice: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3de85',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
