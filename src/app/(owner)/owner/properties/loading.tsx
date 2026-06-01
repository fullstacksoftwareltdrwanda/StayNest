export default function PropertiesLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
