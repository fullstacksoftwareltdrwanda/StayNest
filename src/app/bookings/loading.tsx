export default function BookingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-12 w-full bg-gray-200 rounded-2xl animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
