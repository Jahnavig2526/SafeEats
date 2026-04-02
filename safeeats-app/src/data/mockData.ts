import type { FeedbackItem, MenuItem, Restaurant } from '../types'

export const allergyChips = [
  'Peanut-free',
  'Dairy-free',
  'Gluten-free',
  'Egg-free',
  'Soy-free',
]

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Bowl Kitchen',
    rating: 4.7,
    trustScore: 96,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    cuisine: 'Healthy',
  },
  {
    id: '2',
    name: 'Urban Spice House',
    rating: 4.4,
    trustScore: 82,
    safeTag: 'Mostly safe',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80',
    cuisine: 'Indian',
  },
  {
    id: '3',
    name: 'Harvest and Flame',
    rating: 4.6,
    trustScore: 91,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
    cuisine: 'Mediterranean',
  },
]

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Roasted Veggie Bowl',
    description: 'Quinoa, chickpeas, lemon tahini, herbs',
    status: 'safe',
  },
  {
    id: '2',
    name: 'Creamy Mushroom Pasta',
    description: 'Contains dairy cream and parmesan',
    status: 'unsafe',
  },
  {
    id: '3',
    name: 'House Fries',
    description: 'Potential cross-contact in shared fryer',
    status: 'uncertain',
  },
  {
    id: '4',
    name: 'Charred Salmon Plate',
    description: 'Lemon glaze, asparagus, roasted potatoes',
    status: 'safe',
  },
]

export const feedbackItems: FeedbackItem[] = [
  {
    id: '1',
    user: 'Maya R.',
    rating: 5,
    comment: 'Staff double-checked peanut ingredients and updated me quickly.',
    date: '2d ago',
  },
  {
    id: '2',
    user: 'Arjun S.',
    rating: 4,
    comment: 'Great app. One item was marked safe but changed later in kitchen.',
    date: '5d ago',
  },
]
