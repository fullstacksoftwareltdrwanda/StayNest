'use client'

import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

export function HomeFooter() {
  const { t } = useSettings()

  return (
    <footer className="bg-[var(--primary-dark)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors font-medium">{t('footer.about_us')}</Link></li>
              <li><Link href="/search" className="text-white/70 hover:text-white transition-colors font-medium">{t('footer.explore_stays')}</Link></li>
              <li><Link href="/register" className="text-white/70 hover:text-white transition-colors font-medium">{t('footer.become_host')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="text-white/70 hover:text-white transition-colors font-medium">{t('footer.help_center')}</Link></li>
              <li><span className="text-white/70 font-medium cursor-not-allowed opacity-50">{t('footer.safety')}</span></li>
              <li><span className="text-white/70 font-medium cursor-not-allowed opacity-50">{t('footer.cancellation')}</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/70 font-medium cursor-not-allowed opacity-50">{t('footer.privacy')}</span></li>
              <li><span className="text-white/70 font-medium cursor-not-allowed opacity-50">{t('footer.terms')}</span></li>
              <li><span className="text-white/70 font-medium cursor-not-allowed opacity-50">{t('footer.cookies')}</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-white/70 font-medium font-mono">support@urugostay.com</span></li>
              <li><span className="text-white/70 font-medium">Kigali, Rwanda</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-lg font-black tracking-tighter">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </span>
          <p className="text-xs text-white/40">© 2026 Urugostay. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
