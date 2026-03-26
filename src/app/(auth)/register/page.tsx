'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, CheckCircle, UserPlus } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export default function RegisterPage() {
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
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
        <div className="relative z-10 space-y-6">
          {[
            t('auth.benefits.feature_stays'),
            t('auth.benefits.feature_secure'),
            t('auth.benefits.feature_reviews')
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-medium text-sm">{item}</p>
            </div>
          ))}
        </div>
        <div className="relative z-10 flex gap-8">
          {[
            [t('auth.benefits.free_val'), t('auth.benefits.free_label')],
            [t('auth.benefits.properties_val'), t('auth.benefits.properties_label')],
            [t('auth.benefits.countries_val'), t('auth.benefits.countries_label')]
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
              {t('auth.register_title')}
            </h1>
            <p className="text-gray-500 font-medium">
              {t('auth.register_subtitle')}
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 border border-green-100">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-gray-900">{t('auth.success.title')}</h3>
              <p className="text-gray-500 text-center text-sm">{t('auth.success.redirecting')}</p>
              <LoadingSpinner size="sm" label="" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                name="fullName"
                label={t('auth.full_name')}
                type="text"
                placeholder={t('auth.full_name_placeholder')}
                required
                autoComplete="name"
              />

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
                  placeholder={t('auth.password_placeholder')}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-400 mt-1.5 ml-1">
                  {t('auth.errors.password_length')}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl text-sm font-black gap-2 mt-2"
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

              <p className="text-center text-sm text-gray-500 pt-2">
                {t('auth.have_account')}{' '}
                <Link href="/login" className="text-blue-600 font-black hover:underline">
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
