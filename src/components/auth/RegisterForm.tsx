'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, CheckCircle, UserPlus, Users, Home, Globe, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface RegisterFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function RegisterForm({ stats }: RegisterFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useSettings()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!fullName || !email || !password) {
      setError(t('auth.errors.fill_all'))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t('auth.errors.password_length'))
      setLoading(false)
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setError(
        signUpError.message.includes('already registered')
          ? t('auth.errors.email_taken')
          : signUpError.message
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--primary)] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -right-20 w-80 h-80 bg-[var(--primary-light)] rounded-full opacity-20" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--primary-dark)] rounded-full opacity-20" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          {[
            t('auth.benefits.feature_stays'),
            t('auth.benefits.feature_secure'),
            t('auth.benefits.feature_reviews')
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <p className="text-white font-bold text-lg tracking-tight">{item}</p>
            </div>
          ))}
        </div>
        <div className="relative z-10 flex gap-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[var(--accent)]" />
              <p className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Total Users</p>
          </div>
          <div>
             <div className="flex items-center gap-2 mb-1">
              <Home className="w-5 h-5 text-[var(--accent)]" />
              <p className="text-3xl font-black text-white">{stats.totalProperties.toLocaleString()}</p>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">All Properties</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-[var(--accent)]" />
              <p className="text-3xl font-black text-white">{stats.averageRating > 0 ? stats.averageRating : '0.0'}</p>
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-20 bg-[var(--warm-white)]/30">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <Link href="/" className="text-2xl font-black text-[var(--primary)] tracking-tight lg:hidden block mb-10">
              Urugo<span className="text-[var(--accent)]">stay</span>
            </Link>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              {t('auth.register_title')}
            </h1>
            <p className="text-gray-400 font-medium">
              {t('auth.register_subtitle')}
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-6 py-10 animate-fade-in">
              <div className="w-20 h-20 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 border border-green-100 shadow-xl shadow-green-500/10">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">{t('auth.success.title')}</h3>
                <p className="text-gray-500 text-sm font-medium">{t('auth.success.redirecting')}</p>
              </div>
              <LoadingSpinner size="md" label="" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <Input
                  name="fullName"
                  label={t('auth.full_name')}
                  type="text"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="rounded-2xl border-gray-100 bg-white"
                />

                <Input
                  name="email"
                  label={t('auth.email')}
                  type="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="rounded-2xl border-gray-100 bg-white"
                />

                <div className="space-y-2">
                  <Input
                    name="password"
                    label={t('auth.password')}
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="rounded-2xl border-gray-100 bg-white"
                  />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 ml-1">
                    {t('auth.errors.password_length')}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-sm font-black gap-2 mt-4 shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" label="" />
                    {t('auth.creating_account')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {t('auth.create_account')}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-400 pt-4 font-bold uppercase tracking-widest">
                {t('auth.have_account')}{' '}
                <Link href="/login" className="text-[var(--primary)] font-black hover:underline underline-offset-4 decoration-2">
                  {t('auth.sign_in')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
