'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Profile is now created automatically by a Database Trigger!
    // No need to manually insert from the frontend anymore.
    
    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <FormContainer 
        title="Create your account" 
        subtitle="Join StayNest to find your perfect stay"
      >
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center">
            <p className="font-semibold">Registration successful!</p>
            <p className="text-sm mt-1">Redirecting you to the login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <Input
              name="fullName"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
            />
            
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
              minLength={6}
            />
            
            <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={loading}
            >
              {loading ? 'Creating account...' : 'Registers'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </FormContainer>
    </div>
  )
}
