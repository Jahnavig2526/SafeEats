import { Feather } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { HomeScreen } from './src/screens/HomeScreen'
import { HealthIntakeScreen } from './src/screens/HealthIntakeScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { ProfileScreen } from './src/screens/ProfileScreen'
import { RestaurantScreen } from './src/screens/RestaurantScreen'
import { SettingsScreen } from './src/screens/SettingsScreen'
import { ScanScreen } from './src/screens/ScanScreen'
import { defaultPreferences, loadPreferences, savePreferences, type AppPreferences } from './src/lib/preferences'
import type { TabKey, UserIntakeProfile } from './src/types'

type AppLanguage = AppPreferences['language']

type Copy = {
  home: string
  restaurant: string
  scan: string
  profile: string
  settings: string
  languageDescription: string
  themeDescription: string
  previewTitle: string
  previewBody: string
  currentLabel: string
  activeLanguage: string
  activeTheme: string
  enLabel: string
  esLabel: string
  frLabel: string
  hiLabel: string
  teLabel: string
  midnightLabel: string
  oceanLabel: string
  sandLabel: string
}

const copies: Record<AppLanguage, Copy> = {
  en: {
    home: 'Home',
    restaurant: 'Restaurants',
    scan: 'Scan',
    profile: 'Profile',
    settings: 'Settings',
    languageDescription: 'Choose the language used across the app interface.',
    themeDescription: 'Pick a color mood that matches how you want SafeEats to feel.',
    previewTitle: 'Preference preview',
    previewBody: 'Your selected language and theme are saved automatically and restored on launch.',
    currentLabel: 'Current setting',
    activeLanguage: 'English',
    activeTheme: 'Midnight',
    enLabel: 'English',
    esLabel: 'Spanish',
    frLabel: 'French',
    hiLabel: 'Hindi',
    teLabel: 'Telugu',
    midnightLabel: 'Midnight',
    oceanLabel: 'Ocean',
    sandLabel: 'Sand',
  },
  es: {
    home: 'Inicio',
    restaurant: 'Restaurantes',
    scan: 'Escanear',
    profile: 'Perfil',
    settings: 'Ajustes',
    languageDescription: 'Elige el idioma usado en la interfaz de la app.',
    themeDescription: 'Selecciona un estilo de color que te guste.',
    previewTitle: 'Vista previa de preferencias',
    previewBody: 'Tu idioma y tema se guardan automáticamente y se restauran al iniciar.',
    currentLabel: 'Ajuste actual',
    activeLanguage: 'Español',
    activeTheme: 'Medianoche',
    enLabel: 'Inglés',
    esLabel: 'Español',
    frLabel: 'Francés',
    hiLabel: 'Hindi',
    teLabel: 'Telugu',
    midnightLabel: 'Medianoche',
    oceanLabel: 'Océano',
    sandLabel: 'Arena',
  },
  fr: {
    home: 'Accueil',
    restaurant: 'Restaurants',
    scan: 'Scanner',
    profile: 'Profil',
    settings: 'Paramètres',
    languageDescription: "Choisissez la langue utilisée dans l'interface.",
    themeDescription: 'Choisissez une ambiance de couleur qui vous convient.',
    previewTitle: 'Aperçu des préférences',
    previewBody: 'La langue et le thème choisis sont enregistrés automatiquement.',
    currentLabel: 'Réglage actuel',
    activeLanguage: 'Français',
    activeTheme: 'Minuit',
    enLabel: 'Anglais',
    esLabel: 'Espagnol',
    frLabel: 'Français',
    hiLabel: 'Hindi',
    teLabel: 'Télougou',
    midnightLabel: 'Minuit',
    oceanLabel: 'Océan',
    sandLabel: 'Sable',
  },
  hi: {
    home: 'होम',
    restaurant: 'रेस्टोरेंट',
    scan: 'स्कैन',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    languageDescription: 'ऐप इंटरफ़ेस में उपयोग की जाने वाली भाषा चुनें।',
    themeDescription: 'ऐसा रंग मूड चुनें जो आपको SafeEats के लिए पसंद हो।',
    previewTitle: 'पसंद का पूर्वावलोकन',
    previewBody: 'आपकी चुनी हुई भाषा और थीम अपने आप सहेजी जाती है और ऐप खुलने पर वापस आ जाती है।',
    currentLabel: 'वर्तमान सेटिंग',
    activeLanguage: 'हिंदी',
    activeTheme: 'मिडनाइट',
    enLabel: 'अंग्रेज़ी',
    esLabel: 'स्पेनिश',
    frLabel: 'फ़्रेंच',
    hiLabel: 'हिंदी',
    teLabel: 'तेलुगु',
    midnightLabel: 'मिडनाइट',
    oceanLabel: 'ओशन',
    sandLabel: 'सैंड',
  },
  te: {
    home: 'హోమ్',
    restaurant: 'రెస్టారెంట్లు',
    scan: 'స్కాన్',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్స్',
    languageDescription: 'యాప్ ఇంటర్‌ఫేస్‌లో ఉపయోగించే భాషను ఎంచుకోండి.',
    themeDescription: 'SafeEats కోసం మీకు నచ్చిన రంగుల మూడ్‌ను ఎంచుకోండి.',
    previewTitle: 'ప్రాధాన్యతల ప్రివ్యూ',
    previewBody: 'మీరు ఎంచుకున్న భాష మరియు థీమ్ ఆటోమేటిక్‌గా సేవ్ అవుతాయి మరియు యాప్ తెరిచినప్పుడు తిరిగి వస్తాయి.',
    currentLabel: 'ప్రస్తుత సెట్టింగ్',
    activeLanguage: 'తెలుగు',
    activeTheme: 'మిడ్‌నైట్',
    enLabel: 'ఇంగ్లీష్',
    esLabel: 'స్పానిష్',
    frLabel: 'ఫ్రెంచ్',
    hiLabel: 'హిందీ',
    teLabel: 'తెలుగు',
    midnightLabel: 'మిడ్‌నైట్',
    oceanLabel: 'ఓషన్',
    sandLabel: 'సాండ్',
  },
}

const themeTokens = {
  midnight: {
    background: '#181a1f',
    surface: '#23252b',
    surfaceSoft: '#2b2e36',
    text: '#f8fafc',
    muted: '#8f95a3',
    accent: '#f3de85',
    border: '#2d3138',
  },
  ocean: {
    background: '#0c1728',
    surface: '#13233d',
    surfaceSoft: '#173154',
    text: '#eff6ff',
    muted: '#9db3d6',
    accent: '#6dd6ff',
    border: '#223a5d',
  },
  sand: {
    background: '#f4efe5',
    surface: '#fffaf1',
    surfaceSoft: '#f7f0e4',
    text: '#2f3a40',
    muted: '#72808a',
    accent: '#c98b3a',
    border: '#eadfcd',
  },
} as const

const tabs: Array<{ key: TabKey; icon: keyof typeof Feather.glyphMap }> = [
  { key: 'home', icon: 'home' },
  { key: 'restaurant', icon: 'coffee' },
  { key: 'scan', icon: 'camera' },
  { key: 'profile', icon: 'user' },
  { key: 'settings', icon: 'settings' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [authStep, setAuthStep] = useState<'login' | 'intake' | 'app'>('login')
  const [pendingEmail, setPendingEmail] = useState('')
  const [profile, setProfile] = useState<UserIntakeProfile | null>(null)
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences)
  const [preferencesReady, setPreferencesReady] = useState(false)

  useEffect(() => {
    setAuthStep('login')
  }, [])

  useEffect(() => {
    let mounted = true

    loadPreferences().then((storedPreferences) => {
      if (!mounted) {
        return
      }

      setPreferences(storedPreferences)
      setPreferencesReady(true)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!preferencesReady) {
      return
    }

    savePreferences(preferences)
  }, [preferences, preferencesReady])

  const copy = copies[preferences.language] ?? copies.en
  const theme = themeTokens[preferences.theme]

  const screen = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            theme={theme}
            activeTheme={preferences.theme}
            onQuickThemeChange={(themeKey) => setPreferences((current) => ({ ...current, theme: themeKey }))}
          />
        )
      case 'restaurant':
        return <RestaurantScreen theme={theme} />
      case 'scan':
        return <ScanScreen profile={profile} theme={theme} />
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            theme={theme}
            onProfileUpdate={(updates) => {
              if (profile) {
                setProfile({ ...profile, ...updates })
              }
            }}
          />
        )
      case 'settings':
        return (
          <SettingsScreen
            preferences={preferences}
            copy={copy}
            theme={theme}
            onLanguageChange={(language) => setPreferences((current) => ({ ...current, language }))}
            onThemeChange={(themeKey) => setPreferences((current) => ({ ...current, theme: themeKey }))}
          />
        )
      default:
        return (
          <HomeScreen
            theme={theme}
            activeTheme={preferences.theme}
            onQuickThemeChange={(themeKey) => setPreferences((current) => ({ ...current, theme: themeKey }))}
          />
        )
    }
  }, [activeTab, copy, preferences, profile, theme])

  if (authStep === 'login') {
    return (
      <View style={[styles.app, { backgroundColor: theme.background }]}> 
        <StatusBar style={preferences.theme === 'sand' ? 'dark' : 'light'} />
        <LoginScreen
          onLogin={(email) => {
            setPendingEmail(email)
            setAuthStep('intake')
          }}
        />
      </View>
    )
  }

  if (authStep === 'intake') {
    return (
      <View style={[styles.app, { backgroundColor: theme.background }]}> 
        <StatusBar style={preferences.theme === 'sand' ? 'dark' : 'light'} />
        <HealthIntakeScreen
          userEmail={pendingEmail}
          onComplete={({ allergies, healthIssues, sensitivity }) => {
            setProfile({
              email: pendingEmail,
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
    <View style={[styles.app, { backgroundColor: theme.background }]}> 
      <StatusBar style={preferences.theme === 'sand' ? 'dark' : 'light'} />
      {screen}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          const tabLabel = copy[tab.key]
          return (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Feather name={tab.icon} size={17} color={isActive ? theme.accent : theme.muted} />
              <Text style={[styles.tabLabel, { color: isActive ? theme.accent : theme.muted }]}>{tabLabel}</Text>
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
  },
  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: 20,
    borderWidth: 1,
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
  },
})
