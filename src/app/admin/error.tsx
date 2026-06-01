'use client'

import { useEffect } from 'react'
import { Button } from '@/components/shared/Button'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-6 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Page error</h2>
        <p className="text-sm text-gray-500 font-medium max-w-sm">
          This admin page encountered an error. Your data is safe.
        </p>
      </div>
      <Button onClick={reset} size="md">Reload page</Button>
    </div>
  )
}
