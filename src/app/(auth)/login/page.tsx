'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, LogIn } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export default function LoginPage() {
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-700 rounded-full opacity-30" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black text-white tracking-tighter">
            Urugo<span className="text-blue-200">stay</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-xl font-bold text-white/90 leading-relaxed mb-4">
            "{t('auth.benefits.quote')}"
          </blockquote>
          <p className="text-blue-200 text-sm font-medium">— {t('auth.benefits.team')}</p>
        </div>
        <div className="relative z-10 flex gap-8">
          {[
            [t('auth.benefits.properties_val'), t('auth.benefits.properties_label')],
            [t('auth.benefits.countries_val'), t('auth.benefits.countries_label')],
            [t('auth.benefits.rating_val'), t('auth.benefits.rating_label')]
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-white">{val}</p>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter lg:hidden block mb-8">
              Urugo<span className="text-gray-900">stay</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {t('auth.login_title')}
            </h1>
            <p className="text-gray-500 font-medium">
              {t('auth.login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              name="email"
              label={t('auth.email')}
              type="email"
              placeholder="john@example.com"
              required
              autoComplete="email"
            />

            <div>
              <Input
                name="password"
                label={t('auth.password')}
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl text-sm font-black gap-2 mt-2"
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

            <p className="text-center text-sm text-gray-500 pt-2">
              {t('auth.no_account')}{' '}
              <Link href="/register" className="text-blue-600 font-black hover:underline">
                {t('auth.create_account')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
