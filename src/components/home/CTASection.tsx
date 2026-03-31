'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

export function CTASection() {
  const { t } = useSettings()

  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-0">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--primary)]" />
      <ImigongoPattern variant="dark" opacity={0.18} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary-light)] rounded-full opacity-30 blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--accent)] rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 py-20 px-8 sm:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-[var(--primary-dark)] font-black rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm uppercase tracking-widest shrink-0"
        >
          {t('home.cta.button')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
