import { Feather } from '@expo/vector-icons'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card } from '../components/Card'
import type { AppPreferences, LanguageKey, ThemeKey } from '../lib/preferences'

type ThemePalette = {
  background: string
  surface: string
  surfaceSoft: string
  text: string
  muted: string
  accent: string
  border: string
}

type Copy = {
  settings: string
  languageLabel: string
  themeLabel: string
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

type SettingsScreenProps = {
  preferences: AppPreferences
  copy: Copy
  theme: ThemePalette
  onLanguageChange: (language: LanguageKey) => void
  onThemeChange: (theme: ThemeKey) => void
}

const languageOptions: Array<{ key: LanguageKey; labelKey: keyof Copy }> = [
  { key: 'en', labelKey: 'enLabel' },
  { key: 'es', labelKey: 'esLabel' },
  { key: 'fr', labelKey: 'frLabel' },
  { key: 'hi', labelKey: 'hiLabel' },
  { key: 'te', labelKey: 'teLabel' },
]

const themeOptions: Array<{ key: ThemeKey; labelKey: keyof Copy }> = [
  { key: 'midnight', labelKey: 'midnightLabel' },
  { key: 'ocean', labelKey: 'oceanLabel' },
  { key: 'sand', labelKey: 'sandLabel' },
]

export function SettingsScreen({ preferences, copy, theme, onLanguageChange, onThemeChange }: SettingsScreenProps) {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{copy.settings}</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>{copy.previewBody}</Text>
        </View>
        <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSoft, borderColor: theme.border }]}>
          <Feather name="settings" size={20} color={theme.accent} />
        </View>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        <View style={styles.cardHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: theme.surfaceSoft }]}>
            <Feather name="globe" size={18} color={theme.accent} />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{copy.languageLabel}</Text>
            <Text style={[styles.sectionDescription, { color: theme.muted }]}>{copy.languageDescription}</Text>
          </View>
        </View>

        <View style={styles.choiceRow}>
          {languageOptions.map((option) => {
            const isActive = preferences.language === option.key
            return (
              <Pressable
                key={option.key}
                onPress={() => onLanguageChange(option.key)}
                style={[
                  styles.choiceButton,
                  { borderColor: isActive ? theme.accent : theme.border, backgroundColor: isActive ? theme.surfaceSoft : 'transparent' },
                ]}
              >
                <Text style={[styles.choiceLabel, { color: isActive ? theme.text : theme.muted }]}>{copy[option.labelKey]}</Text>
              </Pressable>
            )
          })}
        </View>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        <View style={styles.cardHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: theme.surfaceSoft }]}>
            <Feather name="droplet" size={18} color={theme.accent} />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{copy.themeLabel}</Text>
            <Text style={[styles.sectionDescription, { color: theme.muted }]}>{copy.themeDescription}</Text>
          </View>
        </View>

        <View style={styles.choiceRow}>
          {themeOptions.map((option) => {
            const isActive = preferences.theme === option.key
            return (
              <Pressable
                key={option.key}
                onPress={() => onThemeChange(option.key)}
                style={[
                  styles.choiceButton,
                  { borderColor: isActive ? theme.accent : theme.border, backgroundColor: isActive ? theme.surfaceSoft : 'transparent' },
                ]}
              >
                <Text style={[styles.choiceLabel, { color: isActive ? theme.text : theme.muted }]}>{copy[option.labelKey]}</Text>
              </Pressable>
            )
          })}
        </View>
      </Card>

      <View style={[styles.previewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
        <Text style={[styles.previewTitle, { color: theme.text }]}>{copy.previewTitle}</Text>
        <Text style={[styles.previewText, { color: theme.muted }]}>{copy.previewBody}</Text>
        <View style={styles.previewStats}>
          <View style={[styles.previewStat, { backgroundColor: theme.surfaceSoft }]}>
            <Text style={[styles.previewStatLabel, { color: theme.muted }]}>{copy.currentLabel}</Text>
            <Text style={[styles.previewStatValue, { color: theme.text }]}>{copy.activeLanguage}</Text>
          </View>
          <View style={[styles.previewStat, { backgroundColor: theme.surfaceSoft }]}>
            <Text style={[styles.previewStatLabel, { color: theme.muted }]}>{copy.currentLabel}</Text>
            <Text style={[styles.previewStatValue, { color: theme.text }]}>{copy.activeTheme}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 38,
    paddingBottom: 132,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  card: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  choiceButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  choiceLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  previewCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  previewStats: {
    flexDirection: 'row',
    gap: 12,
  },
  previewStat: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    gap: 6,
  },
  previewStatLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  previewStatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
})
