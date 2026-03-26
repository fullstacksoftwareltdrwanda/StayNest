'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import es from '@/locales/es.json'

type Language = 'English' | 'French' | 'Spanish' | 'German' | 'Arabic'
type Currency = string // ISO Code e.g. 'USD', 'EUR', 'RWF'

interface SettingsContextType {
  language: Language
  currency: Currency
  setLanguage: (lang: Language) => void
  setCurrency: (curr: Currency) => void
  t: (path: string, options?: Record<string, string>) => string
  formatPrice: (amount: number) => string
  exchangeRates: Record<string, number>
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const locales: Record<string, any> = {
  'English': en,
  'French': fr,
  'Spanish': es,
  // Fallbacks for others for now
  'German': en, 
  'Arabic': en
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('English')
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // 1. Fetch Profile Settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('language, currency')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          if (profile.language) setLanguageState(profile.language as Language)
          if (profile.currency) setCurrencyState(profile.currency)
        }
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  // 2. Fetch Exchange Rates (Base USD)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        if (data && data.rates) {
          setExchangeRates(data.rates)
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err)
      }
    }
    fetchRates()
  }, [])

  const setLanguage = (lang: Language) => setLanguageState(lang)
  const setCurrency = (curr: Currency) => setCurrencyState(curr)

  // 3. Translation Helper
  const t = useCallback((path: string, options?: Record<string, string>) => {
    const keys = path.split('.')
    let current = locales[language] || locales['English']
    
    for (const key of keys) {
      if (!current || current[key] === undefined) return path
      current = current[key]
    }
    
    let translation = current as string
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, value)
      })
    }
    
    return translation
  }, [language])

  // 4. Currency Formatter
  const formatPrice = useCallback((amount: number) => {
    const rate = exchangeRates[currency] || 1
    const converted = amount * rate
    
    return new Intl.NumberFormat(language === 'English' ? 'en-US' : language === 'French' ? 'fr-FR' : 'es-ES', {
      style: 'currency',
      currency: currency,
    }).format(converted)
  }, [currency, exchangeRates, language])

  return (
    <SettingsContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      t,
      formatPrice,
      exchangeRates,
      loading
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
