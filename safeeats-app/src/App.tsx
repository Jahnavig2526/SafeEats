import { useEffect, useMemo, useState } from 'react'
import { AppTopBar } from './components/layout/AppTopBar'
import { BottomNav } from './components/layout/BottomNav'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { RestaurantPage } from './pages/RestaurantPage'
import { ScanPage } from './pages/ScanPage'
import { SettingsPage, type SettingsCopy } from './pages/SettingsPage'
import type { LanguageKey, TabKey, ThemeKey } from './types'

type AppPreferences = {
  language: LanguageKey
  theme: ThemeKey
}

const STORAGE_KEYS = {
  language: 'safeeats-web-language',
  theme: 'safeeats-web-theme',
} as const

const defaultPreferences: AppPreferences = {
  language: 'en',
  theme: 'midnight',
}

const tabs: TabKey[] = ['home', 'restaurant', 'scan', 'profile', 'settings']

const copies: Record<LanguageKey, SettingsCopy> = {
  en: {
    home: 'Home',
    restaurant: 'Restaurants',
    scan: 'Scan',
    profile: 'Profile',
    settings: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
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
    languageLabel: 'Idioma',
    themeLabel: 'Tema',
    languageDescription: 'Elige el idioma usado en la interfaz de la app.',
    themeDescription: 'Selecciona un estilo de color que te guste.',
    previewTitle: 'Vista previa de preferencias',
    previewBody: 'Tu idioma y tema se guardan automáticamente y se restauran al iniciar.',
    currentLabel: 'Ajuste actual',
    activeLanguage: 'Espanol',
    activeTheme: 'Medianoche',
    enLabel: 'Ingles',
    esLabel: 'Espanol',
    frLabel: 'Frances',
    hiLabel: 'Hindi',
    teLabel: 'Telugu',
    midnightLabel: 'Medianoche',
    oceanLabel: 'Oceano',
    sandLabel: 'Arena',
  },
  fr: {
    home: 'Accueil',
    restaurant: 'Restaurants',
    scan: 'Scanner',
    profile: 'Profil',
    settings: 'Parametres',
    languageLabel: 'Langue',
    themeLabel: 'Theme',
    languageDescription: 'Choisissez la langue de l interface.',
    themeDescription: 'Choisissez une ambiance de couleur.',
    previewTitle: 'Apercu des preferences',
    previewBody: 'La langue et le theme choisis sont enregistres automatiquement.',
    currentLabel: 'Reglage actuel',
    activeLanguage: 'Francais',
    activeTheme: 'Minuit',
    enLabel: 'Anglais',
    esLabel: 'Espagnol',
    frLabel: 'Francais',
    hiLabel: 'Hindi',
    teLabel: 'Telugu',
    midnightLabel: 'Minuit',
    oceanLabel: 'Ocean',
    sandLabel: 'Sable',
  },
  hi: {
    home: 'Home',
    restaurant: 'Restaurants',
    scan: 'Scan',
    profile: 'Profile',
    settings: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    languageDescription: 'Choose the language used across the app interface.',
    themeDescription: 'Pick a color mood that matches how you want SafeEats to feel.',
    previewTitle: 'Preference preview',
    previewBody: 'Your selected language and theme are saved automatically and restored on launch.',
    currentLabel: 'Current setting',
    activeLanguage: 'Hindi',
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
  te: {
    home: 'Home',
    restaurant: 'Restaurants',
    scan: 'Scan',
    profile: 'Profile',
    settings: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    languageDescription: 'Choose the language used across the app interface.',
    themeDescription: 'Pick a color mood that matches how you want SafeEats to feel.',
    previewTitle: 'Preference preview',
    previewBody: 'Your selected language and theme are saved automatically and restored on launch.',
    currentLabel: 'Current setting',
    activeLanguage: 'Telugu',
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
}

const themeTokens = {
  midnight: {
    page: 'from-slate-900 via-slate-900 to-slate-800',
    card: 'bg-slate-900 text-slate-100',
    topbar: 'bg-slate-900/95 border-slate-700/70 text-slate-100',
    nav: 'bg-slate-900/95 border-slate-700 text-slate-100',
  },
  ocean: {
    page: 'from-sky-950 via-blue-900 to-cyan-900',
    card: 'bg-blue-950 text-slate-100',
    topbar: 'bg-blue-950/95 border-blue-700/70 text-slate-100',
    nav: 'bg-blue-950/95 border-blue-700 text-slate-100',
  },
  sand: {
    page: 'from-amber-50 via-orange-50 to-yellow-100',
    card: 'bg-white text-slate-900',
    topbar: 'bg-white/95 border-amber-200/80 text-slate-900',
    nav: 'bg-white/95 border-amber-200 text-slate-900',
  },
} as const

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences)

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.language)
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme)

    setPreferences({
      language:
        storedLanguage === 'en' ||
        storedLanguage === 'es' ||
        storedLanguage === 'fr' ||
        storedLanguage === 'hi' ||
        storedLanguage === 'te'
          ? storedLanguage
          : defaultPreferences.language,
      theme: storedTheme === 'midnight' || storedTheme === 'ocean' || storedTheme === 'sand' ? storedTheme : defaultPreferences.theme,
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, preferences.language)
    localStorage.setItem(STORAGE_KEYS.theme, preferences.theme)
  }, [preferences.language, preferences.theme])

  const copy = useMemo(() => copies[preferences.language] ?? copies.en, [preferences.language])
  const theme = themeTokens[preferences.theme]

  const screen = useMemo(() => {
    if (activeTab === 'restaurant') {
      return <RestaurantPage />
    }

    if (activeTab === 'scan') {
      return <ScanPage />
    }

    if (activeTab === 'profile') {
      return <ProfilePage />
    }

    if (activeTab === 'settings') {
      return (
        <SettingsPage
          preferences={preferences}
          copy={copy}
          onLanguageChange={(language) => setPreferences((current) => ({ ...current, language }))}
          onThemeChange={(themeKey) => setPreferences((current) => ({ ...current, theme: themeKey }))}
        />
      )
    }

    return <HomePage />
  }, [activeTab, copy, preferences])

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.page} transition-colors`}> 
      <AppTopBar title={copy[tabs.find((tab) => tab === activeTab) ?? 'home']} themeClassName={theme.topbar} />
      <div className={theme.card}>{screen}</div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} copy={copy} themeClassName={theme.nav} />
    </div>
  )
}

export default App
