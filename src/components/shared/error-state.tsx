import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  type?: 'generic' | 'network' | 'permission'
}

export function ErrorState({
  title,
  message,
  onRetry,
  type = 'generic',
}: ErrorStateProps) {
  const defaults = {
    generic: {
      icon: AlertTriangle,
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
    },
    network: {
      icon: WifiOff,
      title: 'Connection failed',
      message: 'Unable to reach the server. Please check your internet connection.',
    },
    permission: {
      icon: AlertTriangle,
      title: 'Access denied',
      message: 'You do not have permission to view this content.',
    },
  }

  const preset = defaults[type]
  const Icon = preset.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-5 text-red-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">{title ?? preset.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">{message ?? preset.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  )
}
