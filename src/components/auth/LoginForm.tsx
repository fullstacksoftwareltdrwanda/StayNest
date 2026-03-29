'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, LogIn, TrendingUp, Users, Home, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface LoginFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function LoginForm({ stats }: LoginFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useSettings()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError(t('auth.errors.fill_all'))
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? t('auth.errors.invalid_credentials')
          : signInError.message
      )
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left panel - decorative */}
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
        <div className="relative z-10">
          <blockquote className="text-3xl font-black text-white leading-tight mb-4 italic">
            "{t('auth.benefits.quote')}"
          </blockquote>
          <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-[0.2em]">— {t('auth.benefits.team')}</p>
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
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Properties List</p>
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
              {t('auth.login_title')}
            </h1>
            <p className="text-gray-400 font-medium">
              {t('auth.login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <Input
                name="email"
                label={t('auth.email')}
                type="email"
                placeholder="email@example.com"
                required
                autoComplete="email"
                className="rounded-2xl border-gray-100 bg-white"
              />

              <Input
                name="password"
                label={t('auth.password')}
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="rounded-2xl border-gray-100 bg-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-sm font-black gap-2 mt-4 shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" label="" />
                  {t('auth.signing_in')}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t('auth.sign_in')}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 pt-4 font-bold uppercase tracking-widest">
              {t('auth.no_account')}{' '}
              <Link href="/register" className="text-[var(--primary)] font-black hover:underline underline-offset-4 decoration-2">
                {t('auth.create_account')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
