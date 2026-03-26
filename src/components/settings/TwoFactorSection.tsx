'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/utils/cn'
import { 
  ShieldCheck, 
  ShieldAlert, 
  QrCode, 
  Key, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useSettings } from '@/context/SettingsContext'

export function TwoFactorSection() {
  const { t } = useSettings()
  const [factors, setFactors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<{ id: string, qr_code?: string, secret?: string } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'enrolling' | 'verifying' | 'success'>('idle')

  const supabase = createClient()

  const refreshFactors = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (error) {
      console.error('MFA list error:', error)
    } else {
      setFactors(data.all || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshFactors()
  }, [])

  const startEnrollment = async () => {
    setStatus('enrolling')
    setError(null)
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    if (error) {
      setError(error.message)
      setStatus('idle')
      return
    }
    setEnrollment({
      id: data.id,
      qr_code: (data.totp as any).qr_code,
      secret: (data.totp as any).secret
    })
  }

  const verifyMFA = async () => {
    if (!enrollment) return
    setStatus('verifying')
    setError(null)
    
    try {
      // 1. Create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollment.id
      })
      if (challengeError) throw challengeError

      // 2. Verify the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollment.id,
        challengeId: challengeData.id,
        code: verificationCode
      })
      if (verifyError) throw verifyError

      setStatus('success')
      setEnrollment(null)
      setVerificationCode('')
      refreshFactors()
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.')
      setStatus('enrolling')
    }
  }

  const unenroll = async (factorId: string) => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) return
    
    setLoading(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) {
      alert(error.message)
    } else {
      refreshFactors()
    }
  }

  if (loading) return <div className="flex justify-center p-6"><LoadingSpinner label={t('common.settings.two_factor.checking')} /></div>

  const activeFactor = factors.find(f => f.status === 'verified')

  return (
    <div className="space-y-6">
      
      {/* Current Status Header */}
      <div className="flex items-center justify-between p-6 bg-[var(--warm-gray)] rounded-2xl border border-[var(--warm-gray-dark)]/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
            activeFactor ? "bg-green-50" : "bg-amber-50"
          )}>
            {activeFactor 
              ? <ShieldCheck className="w-6 h-6 text-green-600" /> 
              : <ShieldAlert className="w-6 h-6 text-amber-600" />
            }
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 mb-1">
              {t('common.settings.two_factor.title')}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {activeFactor 
                ? t('common.settings.two_factor.protected')
                : t('common.settings.two_factor.setup_desc')}
            </p>
          </div>
        </div>

        {!activeFactor && !enrollment && (
          <button 
            onClick={startEnrollment}
            className="px-6 py-2.5 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-[var(--primary)]/10"
          >
            {t('common.settings.two_factor.enable')}
          </button>
        )}

        {activeFactor && (
          <button 
            onClick={() => unenroll(activeFactor.id)}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            {t('common.disable')}
          </button>
        )}
      </div>

      {/* Enrollment Flow */}
      {enrollment && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white p-8 rounded-3xl border-2 border-[var(--primary)] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-[var(--primary)]" />
              <h4 className="text-lg font-black text-gray-900">{t('common.settings.two_factor.setup_title')}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                {enrollment.qr_code ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: enrollment.qr_code }} 
                    className="w-48 h-48 bg-white p-2 border rounded-xl mb-4 [&_svg]:w-full [&_svg]:h-full"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4">
                    <LoadingSpinner label={t('common.settings.two_factor.generating_qr')} />
                  </div>
                )}
                <p className="text-[10px] text-gray-400 font-bold uppercase text-center">
                  {t('common.settings.two_factor.scan_hint')}
                </p>
              </div>

              {/* Manual Entry & Verification */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                    <Key className="w-3 h-3" /> {t('common.settings.two_factor.manual_code')}
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl font-mono text-xs tracking-wider font-black text-gray-600 border border-gray-100 break-all select-all">
                    {enrollment.secret}
                  </div>
                </div>

                <div className="space-y-2">
                  <Input 
                    label={t('common.settings.two_factor.verification_code')}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    autoFocus
                  />
                  {error && (
                    <p className="text-[10px] text-red-500 font-black flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {error}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={verifyMFA}
                    disabled={verificationCode.length !== 6 || status === 'verifying'}
                    className="flex-1 py-4 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {status === 'verifying' ? <LoadingSpinner size="sm" label="" /> : t('common.settings.two_factor.confirm_activate')}
                  </button>
                  <button 
                    onClick={() => {
                      setEnrollment(null)
                      setStatus('idle')
                    }}
                    className="px-6 py-4 text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-xs font-black text-green-700">{t('common.settings.two_factor.success')}</p>
        </div>
      )}
    </div>
  )
}
