'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'
import { cn } from '@/utils/cn'

interface LoginFormProps {
  stats: { totalUsers: number; totalProperties: number; averageRating: number }
}

// ── Minimal architectural input ────────────────────────────────────────────
function ArchInput({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  required,
  hint,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  hint?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : (type || 'text')

  return (
    <div className="group space-y-2">
      <label className="block text-[9px] font-black text-gray-400/80 uppercase tracking-[0.35em]">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-3 pr-10 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 peer"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-0 bottom-3 text-gray-300 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {/* Gold accent line that grows on focus */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent-light)] transition-all duration-500 peer-focus:w-full" />
      </div>
      {hint && <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest mt-1">{hint}</p>}
    </div>
  )
}

// ── Floating stat chip ──────────────────────────────────────────────────────
function StatChip({ value, label, delay }: { value: string | number; label: string; delay: string }) {
  return (
    <div
      className="animate-float flex items-baseline gap-2 opacity-0 animate-reveal-up"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{value}</span>
      <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">{label}</span>
    </div>
  )
}

export function LoginForm({ stats }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || searchParams.get('callbackUrl')
  const verified = searchParams.get('verified') === 'true'
  const errorParam = searchParams.get('error')
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (errorParam === 'invalid-link' || errorParam === 'link-expired') {
      toast.error('This link is invalid or has expired.')
    } else if (errorParam) {
      toast.error('Authentication failed. Please try again.')
    }
  }, [errorParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const password = fd.get('password') as string

    if (!email || !password) {
      toast.error('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      toast.error('Invalid email or password.')
      setLoading(false)
    } else {
      toast.success('Welcome back!')
      if (redirect) {
        router.push(redirect)
      } else {
        const { getSession } = await import('next-auth/react')
        const session = await getSession()
        const role = (session?.user as any)?.role
        router.push(role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/')
      }
      router.refresh()
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[#0A1E16]">

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — "The Stage"
          Full immersive visual experience on desktop
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[58%] h-full relative flex-col overflow-hidden">

        {/* Imigongo heritage pattern fills entire panel */}
        <ImigongoPattern variant="dark" opacity={0.18} className="absolute inset-0 w-full h-full" />

        {/* Deep radial gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E16] via-[#0F2F23]/80 to-[#0A1E16]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(15,47,35,0)_0%,rgba(10,30,22,0.7)_100%)]" />

        {/* Giant ghost watermark text — STAYNEST */}
        <div
          className="absolute pointer-events-none select-none font-black text-white/[0.03] tracking-tighter leading-none"
          style={{
            fontSize: 'clamp(120px, 12vw, 180px)',
            fontFamily: 'var(--font-serif)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-20deg)',
            whiteSpace: 'nowrap',
          }}
        >
          STAYNEST
        </div>

        {/* ── Concentric diamond rings (rotating focal point) ── */}
        <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Outermost — barely visible, slow spin */}
          <div
            className="absolute border border-[var(--accent)]/[0.06] rotate-45"
            style={{ width: 520, height: 520, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(45deg)' }}
          />
          {/* Middle ring — gentle counter-spin */}
          <div
            className="absolute border border-[var(--accent)]/[0.10] animate-counter-spin"
            style={{ width: 360, height: 360, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(45deg)', animationDuration: '24s' }}
          />
          {/* Inner ring — slightly brighter, slow spin */}
          <div
            className="absolute border border-[var(--accent)]/[0.18]"
            style={{
              width: 200, height: 200,
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) rotate(45deg)',
              animation: 'scan-line-h 0s linear, counter-spin 14s linear infinite',
            }}
          />
          {/* Core dot */}
          <div
            className="absolute w-2 h-2 bg-[var(--accent)]/40 rounded-full animate-pulse"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          />
        </div>

        {/* ── Vertical scan line ── */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent pointer-events-none animate-scan-line"
        />

        {/* ── Gold diagonal accent lines ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-[var(--accent)]/8 to-transparent" />
          <div className="absolute top-0 left-[75%] w-px h-full bg-gradient-to-b from-transparent via-[var(--accent)]/6 to-transparent" />
        </div>

        {/* ── Logo ── */}
        <div
          className="relative z-10 p-10 opacity-0 animate-reveal-up"
          style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
        >
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
              <span className="text-[var(--primary)] font-black text-xs">SN</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              Stay<span className="text-[var(--accent)]">Nest</span>
            </span>
          </Link>
        </div>

        {/* ── Center editorial quote ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-14 xl:px-20">
          <div
            className="space-y-6 opacity-0 animate-reveal-up"
            style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-[2px] bg-[var(--accent)]" />
            <blockquote
              className="text-3xl xl:text-4xl font-bold text-white/90 leading-[1.25] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              "Your sanctuary<br />
              <em className="text-[var(--accent)] not-italic">awaits</em>."
            </blockquote>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
              Rwanda's Premier Stay Experience
            </p>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div
          className="relative z-10 p-10 xl:p-14 flex items-end justify-between border-t border-white/5 opacity-0 animate-reveal-up"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-12">
            <StatChip value={stats.totalProperties.toLocaleString()} label="Properties" delay="400ms" />
            <StatChip value={stats.totalUsers.toLocaleString()} label="Travelers" delay="520ms" />
            <StatChip value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'} label="Avg Rating" delay="640ms" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — "The Portal"
          Architectural white form space
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:w-[42%] h-full overflow-y-auto flex flex-col bg-[var(--warm-white)] border-l-[2px] border-[var(--accent)]">

        {/* Mobile header strip — dark with logo */}
        <div className="lg:hidden relative overflow-hidden bg-[#0A1E16] px-6 py-8">
          <ImigongoPattern variant="dark" opacity={0.15} className="absolute inset-0 w-full h-full" />
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--primary)] font-black text-[10px]">SN</span>
            </div>
            <span className="text-white font-black text-base tracking-tight">
              Stay<span className="text-[var(--accent)]">Nest</span>
            </span>
          </Link>
        </div>

        {/* Form container — vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 xl:px-16 py-12">
          <div
            className="w-full max-w-sm mx-auto space-y-10 opacity-0 animate-reveal-left"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {/* Heading */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.4em]">
                Welcome back
              </p>
              <h1
                className="text-3xl xl:text-4xl font-bold text-[var(--primary)] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Enter your<br />
                <em>space.</em>
              </h1>
              <p className="text-xs font-medium text-gray-400 pt-1">
                Your personal sanctuary awaits.
              </p>
            </div>

            {/* Alerts */}
            {verified && (
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-reveal-up">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-emerald-800">Email verified! You can now sign in.</p>
              </div>
            )}
            {errorParam && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-red-800">Authentication failed. Please try again.</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-7">
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-2">
                <Link
                  href="/forgot-password"
                  className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[var(--accent)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] transition-all active:scale-[0.98] flex items-center justify-center gap-3',
                  loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[var(--accent-dark)] via-[var(--accent)] to-[var(--accent-light)] text-[var(--primary)] shadow-xl shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:brightness-110'
                )}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" label="" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Enter Your Space
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
              No account?{' '}
              <Link
                href="/register"
                className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors underline underline-offset-4 decoration-[var(--accent)]/30"
              >
                Join StayNest
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom brand mark */}
        <div className="px-8 sm:px-12 xl:px-16 py-6 border-t border-gray-100/60">
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.35em]">
            © StayNest · Rwanda's luxury stay network
          </p>
        </div>
      </div>

    </div>
  )
}
