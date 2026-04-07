import { motion } from 'framer-motion'
import { useState } from 'react'
import type { IconType } from 'react-icons'
import { LuBean, LuEgg, LuFish, LuHeartPulse, LuMilk, LuNut, LuWheat, LuWind, LuWheatOff, LuDroplets } from 'react-icons/lu'
import type { LanguageKey, ThemeKey } from '../types'

export type SettingsCopy = {
  home: string
  restaurant: string
  scan: string
  profile: string
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

type SettingsPageProps = {
  preferences: {
    language: LanguageKey
    theme: ThemeKey
  }
  copy: SettingsCopy
  onLanguageChange: (language: LanguageKey) => void
  onThemeChange: (theme: ThemeKey) => void
}

type AllergyOption = {
  key: string
  label: string
  icon: IconType
}

type ConditionOption = {
  key: string
  label: string
  icon: IconType
}

type RiskLevel = 'strict' | 'moderate' | 'flexible'

const foodAllergies: AllergyOption[] = [
  { key: 'milk', label: 'Milk', icon: LuMilk },
  { key: 'eggs', label: 'Eggs', icon: LuEgg },
  { key: 'gluten', label: 'Gluten', icon: LuWheat },
  { key: 'soy', label: 'Soy', icon: LuBean },
  { key: 'peanuts', label: 'Peanuts', icon: LuNut },
  { key: 'fish', label: 'Fish', icon: LuFish },
]

const conditions: ConditionOption[] = [
  { key: 'asthma', label: 'Asthma', icon: LuWind },
  { key: 'eczema', label: 'Eczema', icon: LuDroplets },
  { key: 'high-bp', label: 'High BP', icon: LuHeartPulse },
  { key: 'celiac', label: 'Celiac', icon: LuWheatOff },
]

export function SettingsPage(_props: SettingsPageProps) {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['peanuts'])
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['celiac'])
  const [riskTolerance, setRiskTolerance] = useState<RiskLevel>('moderate')

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap !max-w-none !px-0 !pb-0 !pt-0"
    >
      <div className="mx-auto min-h-[calc(100vh-6rem)] w-full max-w-[460px] px-3 py-5 sm:px-0 sm:py-8">
        <div className="rounded-[2rem] border border-[#e6dcc9] bg-[#f7f2e8] px-4 pb-5 pt-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-5 sm:pb-6">
          <div className="mx-auto mb-4 h-1.5 w-28 rounded-full bg-slate-950/95" />

          <header className="px-3 pb-5 pt-2 text-center sm:px-6 sm:pt-3">
            <h1 className="text-[2rem] font-extrabold tracking-[-0.05em] text-[#11274a] sm:text-[2.25rem]">Set Your Preferences</h1>
            <p className="mx-auto mt-2 max-w-[24rem] text-[1.03rem] leading-6 text-[#2f3e57] sm:text-[1.08rem]">
              Personalize your settings to find safe food options for you.
            </p>
          </header>

          <section className="space-y-4">
            <div className="rounded-[1.75rem] border border-[#eadfcd] bg-[#fbf7ef] p-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:p-5">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13284a]">Food Allergies</h2>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-5">
                {foodAllergies.map(({ key, label, icon: Icon }) => {
                  const isActive = selectedAllergies.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setSelectedAllergies((current: string[]) =>
                          current.includes(key) ? current.filter((item: string) => item !== key) : [...current, key]
                        )
                      }
                      className="flex flex-col items-center gap-2 text-center"
                    >
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border transition sm:h-28 sm:w-28 ${
                          isActive
                            ? 'border-emerald-400 bg-emerald-100/85 shadow-[0_10px_24px_rgba(16,185,129,0.24)]'
                            : 'border-transparent bg-[#f0ede7]'
                        }`}
                      >
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full ${isActive ? 'text-emerald-700' : 'text-[#4e5c76]'}`}
                        >
                          <Icon className="h-12 w-12" strokeWidth={1.8} />
                        </div>
                      </div>
                      <span className="text-[1.02rem] font-medium text-[#22324f]">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#eadfcd] bg-[#fbf7ef] p-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:p-5">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13284a]">Relevant Medical Conditions</h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {conditions.map(({ key, label, icon: Icon }) => {
                  const isActive = selectedConditions.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setSelectedConditions((current: string[]) =>
                          current.includes(key) ? current.filter((item: string) => item !== key) : [...current, key]
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[1rem] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-400 text-white'
                          : 'border-[#d2c9b6] bg-[#f8f4ec] text-[#525b67]'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                      <span className="font-medium">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#eadfcd] bg-[#fbf7ef] p-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:p-5">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#13284a]">Risk Tolerance</h2>
              <div className="mt-4 rounded-full bg-[#13284a] p-1.5 shadow-[0_10px_24px_rgba(19,40,74,0.18)]">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'strict' as const, label: 'Strict' },
                    { key: 'moderate' as const, label: 'Moderate' },
                    { key: 'flexible' as const, label: 'Flexible' },
                  ].map((option) => {
                    const isActive = riskTolerance === option.key
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setRiskTolerance(option.key)}
                        className={`rounded-full px-3 py-3 text-[1.02rem] font-medium transition ${
                          isActive ? 'bg-[#f99b1b] text-white shadow-[0_6px_16px_rgba(249,155,27,0.4)]' : 'text-[#edf2fa]'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-full bg-gradient-to-b from-[#4ed6ab] to-[#2dbd86] px-5 py-4 text-[1.15rem] font-extrabold text-white shadow-[0_16px_32px_rgba(45,189,134,0.34)] transition hover:brightness-105"
              >
                Find Safe Meals
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.main>
  )
}
