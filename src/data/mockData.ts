import type { FeedbackItem, MenuItem, Restaurant } from '../types'

export const allergyChips = ['Peanut-free', 'Dairy-free', 'Gluten-free', 'Egg-free', 'Soy-free']

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Bowl Kitchen',
    rating: 4.7,
    trustScore: 96,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    latitude: 40.7505,
    longitude: -73.9972,
    address: '123 Park Ave, New York, NY 10016',
  },
  {
    id: '2',
    name: 'Urban Spice House',
    rating: 4.4,
    trustScore: 82,
    safeTag: 'Mostly safe',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    latitude: 40.7489,
    longitude: -73.9680,
    address: '456 5th Ave, New York, NY 10017',
  },
  {
    id: '3',
    name: 'Harvest and Flame',
    rating: 4.6,
    trustScore: 91,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
    latitude: 40.7614,
    longitude: -73.9776,
    address: '789 Madison Ave, New York, NY 10016',
  },
  {
    id: '4',
    name: 'Sunrise Cafe',
    rating: 4.5,
    trustScore: 88,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    latitude: 40.7549,
    longitude: -73.9840,
    address: '321 Broadway, New York, NY 10007',
  },
  {
    id: '5',
    name: 'The Vegan Table',
    rating: 4.8,
    trustScore: 94,
    safeTag: 'Safe for you',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    latitude: 40.7480,
    longitude: -73.9862,
    address: '654 Houston St, New York, NY 10014',
  },
]

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Roasted Veggie Bowl',
    description: 'Quinoa, chickpeas, lemon tahini, herbs',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '2',
    name: 'Creamy Mushroom Pasta',
    description: 'Contains dairy cream and parmesan',
    image: 'https://images.unsplash.com/photo-1608756687911-aa1599ab0386?auto=format&fit=crop&w=900&q=80',
    status: 'unsafe',
  },
  {
    id: '3',
    name: 'House Fries',
    description: 'Potential cross-contact in shared fryer',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
    status: 'uncertain',
  },
  {
    id: '4',
    name: 'Vegan Tofu Power Bowl',
    description: 'Vegan, healthy food with tofu, kale, brown rice, and sesame',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '5',
    name: 'Green Detox Smoothie',
    description: 'Drinks category with spinach, apple, ginger, and chia',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90f7f6b?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '6',
    name: 'Italian Margherita Flatbread',
    description: 'Italian dish with basil, tomato, mozzarella, and olive oil',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    status: 'uncertain',
  },
  {
    id: '7',
    name: 'Asian Stir-Fry Noodles',
    description: 'Asian noodles with vegetables, tamari, and spring onions',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '8',
    name: 'Healthy Food Protein Salad',
    description: 'Healthy food salad with lentils, avocado, cucumber, and seeds',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '9',
    name: 'Vegan Coconut Curry',
    description: 'Vegan Asian curry with coconut milk and mixed vegetables',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    status: 'uncertain',
  },
  {
    id: '10',
    name: 'Italian Lemon Herb Pasta',
    description: 'Italian pasta with lemon zest, garlic, parsley, and olive oil',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '11',
    name: 'Sparkling Citrus Cooler',
    description: 'Drinks option with lime, mint, orange, and soda water',
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=900&q=80',
    status: 'safe',
  },
  {
    id: '12',
    name: 'Asian Ginger Soup',
    description: 'Healthy food Asian soup with ginger, bok choy, and tofu',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
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
    comment: 'One item changed in kitchen and got re-flagged. Helpful updates.',
    date: '5d ago',
  },
]
