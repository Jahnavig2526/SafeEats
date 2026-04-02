import AsyncStorage from '@react-native-async-storage/async-storage'

export type LanguageKey = 'en' | 'es' | 'fr' | 'hi' | 'te'
export type ThemeKey = 'midnight' | 'ocean' | 'sand'

export type AppPreferences = {
  language: LanguageKey
  theme: ThemeKey
}

const STORAGE_KEYS = {
  language: 'safeeats-language',
  theme: 'safeeats-theme',
} as const

export const defaultPreferences: AppPreferences = {
  language: 'en',
  theme: 'midnight',
}

export async function loadPreferences(): Promise<AppPreferences> {
  try {
    const [storedLanguage, storedTheme] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.language),
      AsyncStorage.getItem(STORAGE_KEYS.theme),
    ])

    return {
      language:
        storedLanguage === 'es' ||
        storedLanguage === 'fr' ||
        storedLanguage === 'hi' ||
        storedLanguage === 'te'
          ? storedLanguage
          : defaultPreferences.language,
      theme: storedTheme === 'ocean' || storedTheme === 'sand' ? storedTheme : defaultPreferences.theme,
    }
  } catch {
    return defaultPreferences
  }
}

export async function savePreferences(preferences: AppPreferences) {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.language, preferences.language),
      AsyncStorage.setItem(STORAGE_KEYS.theme, preferences.theme),
    ])
  } catch {
    return undefined
  }
}
