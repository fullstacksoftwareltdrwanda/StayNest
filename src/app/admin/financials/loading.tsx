export default function AdminFinancialsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-44 bg-gray-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 w-full bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-80 w-full bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  )
}
