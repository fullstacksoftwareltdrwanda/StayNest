'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <FormContainer 
        title="Welcome back" 
        subtitle="Sign in to your StayNest account"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
          />
          
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full h-11" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>
      </FormContainer>
    </div>
  )
}
