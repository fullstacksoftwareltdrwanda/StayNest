'use client'

import { useEffect } from 'react'
import { Button } from '@/components/shared/Button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Something went wrong</h1>
          <p className="text-sm text-gray-500 font-medium">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="md">
            Try again
          </Button>
          <Button variant="outline" size="md" onClick={() => window.location.href = '/'}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
