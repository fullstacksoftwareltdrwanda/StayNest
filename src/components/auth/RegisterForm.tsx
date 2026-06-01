'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '@/app/(auth)/register/actions'
import { signIn } from 'next-auth/react'
import { LoadingSpinner, UrugostayLoader } from '@/components/shared/loading-spinner'
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'
import { cn } from '@/utils/cn'

interface RegisterFormProps {
  stats: { totalUsers: number; totalProperties: number; averageRating: number }
}

// ── Shared minimal input component ─────────────────────────────────────────
function ArchInput({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  required,
  minLength,
  dark,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  dark?: boolean
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : (type || 'text')

  const labelClass = dark
    ? 'text-[9px] font-black text-white/40 uppercase tracking-[0.35em]'
    : 'text-[9px] font-black text-gray-400/80 uppercase tracking-[0.35em]'

  const inputClass = dark
    ? 'w-full bg-transparent border-0 border-b-2 border-white/15 py-3 pr-10 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 peer'
    : 'w-full bg-transparent border-0 border-b-2 border-gray-200 py-3 pr-10 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 peer'

  const lineClass = 'absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent-light)] transition-all duration-500 peer-focus:w-full'

  return (
    <div className="space-y-2 group">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className={inputClass}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className={cn('absolute right-0 bottom-3 transition-colors', dark ? 'text-white/25 hover:text-white/60' : 'text-gray-300 hover:text-gray-600')}
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        <div className={lineClass} />
      </div>
    </div>
  )
}

// ── Benefit row ─────────────────────────────────────────────────────────────
function Benefit({ n, text, delay }: { n: string; text: string; delay: string }) {
  return (
    <div
      className="flex items-start gap-4 opacity-0 animate-reveal-up"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      <span className="text-[9px] font-black text-[var(--accent)]/60 uppercase tracking-widest pt-0.5 shrink-0">{n}</span>
      <div className="h-px w-4 bg-[var(--accent)]/20 mt-2 shrink-0" />
      <p className="text-sm font-medium text-white/70 leading-snug">{text}</p>
    </div>
  )
}

export function RegisterForm({ stats }: RegisterFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const fullName = fd.get('fullName') as string
    const email = fd.get('email') as string
    const password = fd.get('password') as string

    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await registerUser({ fullName, email, password })
      if (!result.success) throw new Error('Registration failed')
      toast.success('Account created!')
      setSuccess(true)
      const signInResult = await signIn('credentials', { email, password, redirect: false })
      setTimeout(() => router.push(signInResult?.error ? '/login' : '/'), 2200)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-[#0A1E16] flex items-center justify-center py-8 px-4 relative">

      {/* Full-screen Imigongo backdrop */}
      <ImigongoPattern variant="dark" opacity={0.12} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Ambient glow in center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(191,160,84,0.04)_0%,transparent_70%)]" />

      {/* Vertical scan line across full screen */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent pointer-events-none animate-scan-line" />

      {/* ── The Card ──────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden opacity-0 animate-reveal-up"
        style={{
          animationDelay: '100ms',
          animationFillMode: 'forwards',
          borderRadius: '2rem',
          boxShadow: '0 0 0 1px rgba(191,160,84,0.15), 0 40px 100px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >

        {/* ══ LEFT HALF — Dark green, editorial benefits ══ */}
        <div className="relative lg:w-[45%] bg-[#0F2F23] overflow-hidden flex flex-col">
          {/* Imigongo inside left panel */}
          <ImigongoPattern variant="dark" opacity={0.20} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Inner depth gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E16]/50 via-transparent to-[#0A1E16]/80" />

          {/* Gold top accent bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

          <div className="relative z-10 flex flex-col h-full p-8 lg:p-10 xl:p-12">
            {/* Logo */}
            <div className="mb-auto">
              <Link href="/" className="flex items-center gap-2.5 mb-8 lg:mb-14">
                <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                  <span className="text-[var(--primary)] font-black text-[9px]">SN</span>
                </div>
                <span className="text-white font-black text-base tracking-tight">
                  Stay<span className="text-[var(--accent)]">Nest</span>
                </span>
              </Link>

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 mb-6 opacity-0 animate-reveal-up"
                style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-[9px] font-black text-[var(--accent)]/80 uppercase tracking-[0.3em]">
                  {stats.totalUsers.toLocaleString()}+ travelers
                </span>
              </div>

              {/* Big editorial heading */}
              <div
                className="space-y-0 opacity-0 animate-reveal-up mb-8 lg:mb-10"
                style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
              >
                <p
                  className="font-black text-white/30 leading-none text-sm uppercase tracking-[0.3em]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Begin
                </p>
                <p
                  className="font-bold text-white leading-none"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 4vw, 56px)' }}
                >
                  Your
                </p>
                <p
                  className="font-bold leading-none"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(40px, 4vw, 56px)',
                    background: 'linear-gradient(135deg, #BFA054, #D4B976)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Journey.
                </p>
              </div>

              {/* Numbered benefits */}
              <div className="space-y-4 lg:space-y-5">
                <Benefit n="01" text="Handpicked luxury stays across Rwanda" delay="450ms" />
                <Benefit n="02" text="Verified hosts, secure instant booking" delay="550ms" />
                <Benefit n="03" text="Seamless travel from first click to check-out" delay="650ms" />
              </div>
            </div>

            {/* Stats footer */}
            <div
              className="flex items-center gap-8 pt-6 mt-8 border-t border-white/5 opacity-0 animate-reveal-up"
              style={{ animationDelay: '750ms', animationFillMode: 'forwards' }}
            >
              <div>
                <p className="text-xl font-black text-white tracking-tighter tabular-nums">{stats.totalProperties}</p>
                <p className="text-[8px] font-black text-white/25 uppercase tracking-[0.25em]">Properties</p>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div>
                <p className="text-xl font-black text-white tracking-tighter">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}</p>
                <p className="text-[8px] font-black text-white/25 uppercase tracking-[0.25em]">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT HALF — Cream, minimal form ══ */}
        <div className="flex-1 bg-[var(--warm-white)] flex flex-col">

          {/* Gold top accent bar */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent lg:hidden" />

          <div className="flex-1 flex flex-col justify-center p-8 lg:p-10 xl:p-12">

            {success ? (
              <div className="flex flex-col items-center justify-center gap-6 py-10 text-center animate-reveal-up">
                <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary)] flex items-center justify-center shadow-xl shadow-[var(--primary)]/20">
                  <Check className="w-10 h-10 text-[var(--accent)]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold text-[var(--primary)] tracking-tight mb-2"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Welcome to StayNest.
                  </h3>
                  <p className="text-sm font-medium text-gray-400">Your journey begins now.</p>
                </div>
                <div className="mt-2">
                  <UrugostayLoader size="sm" />
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-sm mx-auto w-full">

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.4em]">
                    New account
                  </p>
                  <h2
                    className="text-2xl xl:text-3xl font-bold text-[var(--primary)] tracking-tight leading-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Create your<br /><em>profile.</em>
                  </h2>
                  <p className="text-xs font-medium text-gray-400 pt-0.5">
                    Join thousands of travelers.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-7">
                    <ArchInput
                      name="fullName"
                      label="Full Name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                    <ArchInput
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                    <ArchInput
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] transition-all active:scale-[0.98] flex items-center justify-center gap-3',
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 hover:bg-[var(--primary-light)] hover:shadow-[var(--primary)]/30'
                    )}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" label="" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Begin Your Journey
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  Have an account?{' '}
                  <Link
                    href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                    className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors underline underline-offset-4 decoration-[var(--accent)]/30"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="px-8 lg:px-10 xl:px-12 py-5 border-t border-gray-100/60">
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.35em]">
              By joining, you agree to our{' '}
              <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Terms</Link>
              {' & '}
              <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>

      </div>

      {/* Back to home — bottom of page */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-reveal-up"
        style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
      >
        <Link
          href="/"
          className="text-[8px] font-black text-white/20 uppercase tracking-[0.35em] hover:text-[var(--accent)]/60 transition-colors"
        >
          ← Back to StayNest
        </Link>
      </div>

    </div>
  )
}
