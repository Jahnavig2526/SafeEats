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
