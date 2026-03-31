'use client'

import { Property } from '@/types/property'
import { Info, ShieldCheck, Map, Sparkles } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface PropertyOverviewProps {
  property: Property
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  const { t } = useSettings()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-12">
        <Card variant="default" padding="lg" className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02]">
          <CardHeader
            title={t('details.about')}
            icon={<Info className="w-5 h-5 text-[var(--primary)]" />}
          />
          <CardContent>
            <div className="text-gray-600 text-lg sm:text-xl whitespace-pre-wrap leading-relaxed font-medium text-balance opacity-90">
              {property.description}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" className="rounded-[2.5rem] border-[var(--primary)]/5">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--primary)]/10 flex items-center justify-center shrink-0 border border-[var(--primary)]/10">
              <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-balance">
                {t('details.guarantee_title')}
              </h2>
              <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
                {t('details.guarantee_text')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-8">
        <Card variant="outline" padding="lg" className="rounded-[2.5rem] h-full bg-[var(--warm-white)]/40 border-[var(--warm-gray)]/50">
          <CardHeader
            title={t('details.neighborhood')}
            icon={<Map className="w-5 h-5 text-[var(--accent)]" />}
          />
          <CardContent className="space-y-8">
            <p className="text-base text-gray-500 font-medium leading-relaxed italic opacity-80">
              {t('details.neighborhood_desc', { 
                city: property.city, 
                type: property.type.toLowerCase() 
              })}
            </p>
            <div className="aspect-square bg-white rounded-[2rem] border-4 border-white shadow-inner flex flex-col items-center justify-center text-gray-300 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <Map className="w-6 h-6 opacity-40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[120px] leading-relaxed">
                {t('details.map_soon')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
