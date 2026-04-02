import { Feather } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FeedbackScreen } from './src/screens/FeedbackScreen'
import { HealthIntakeScreen } from './src/screens/HealthIntakeScreen'
import { HomeScreen } from './src/screens/HomeScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { ProfileScreen } from './src/screens/ProfileScreen'
import { RestaurantScreen } from './src/screens/RestaurantScreen'
import { ScanScreen } from './src/screens/ScanScreen'
import type { TabKey, UserIntakeProfile } from './src/types'

const tabs: Array<{ key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }> = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'restaurant', label: 'Restaurants', icon: 'coffee' },
  { key: 'scan', label: 'Scan', icon: 'camera' },
  { key: 'feedback', label: 'Review', icon: 'message-square' },
  { key: 'profile', label: 'Profile', icon: 'user' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [authStep, setAuthStep] = useState<'login' | 'intake' | 'app'>('login')
  const [profile, setProfile] = useState<UserIntakeProfile | null>(null)

  const screen = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />
      case 'restaurant':
        return <RestaurantScreen />
      case 'scan':
        return <ScanScreen profile={profile} />
      case 'feedback':
        return <FeedbackScreen />
      case 'profile':
        return <ProfileScreen profile={profile} />
      default:
        return <HomeScreen />
    }
  }, [activeTab, profile])

  if (authStep === 'login') {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        <LoginScreen
          onLogin={(email) => {
            setProfile({
              email,
              allergies: [],
              healthIssues: [],
              sensitivity: 'Moderate',
            })
            setAuthStep('intake')
          }}
        />
      </View>
    )
  }

  if (authStep === 'intake' && profile) {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        <HealthIntakeScreen
          userEmail={profile.email}
          onComplete={({ allergies, healthIssues, sensitivity }) => {
            setProfile({
              ...profile,
              allergies,
              healthIssues,
              sensitivity,
            })
            setAuthStep('app')
          }}
        />
      </View>
    )
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      {screen}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Feather name={tab.icon} size={17} color={isActive ? '#f3de85' : '#8f95a3'} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#181a1f',
  },
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    backgroundColor: '#23252b',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 7,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 7,
    gap: 2,
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8f95a3',
  },
  tabLabelActive: {
    color: '#f3de85',
  },
})
