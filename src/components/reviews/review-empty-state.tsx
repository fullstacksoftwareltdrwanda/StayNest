import { MessageSquare } from 'lucide-react'

export function ReviewEmptyState({ message = "No reviews found yet." }: { message?: string }) {
  return (
    <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm border-dashed">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
        <MessageSquare size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
      <p className="text-gray-400 max-w-xs mx-auto text-sm">
        {message}
      </p>
    </div>
  )
}
