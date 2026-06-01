export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 w-full bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
