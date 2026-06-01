export default function AdminPropertiesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
      <div className="h-12 w-full bg-gray-200 rounded-2xl animate-pulse" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
