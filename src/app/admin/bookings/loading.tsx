export default function AdminBookingsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-20 w-full bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
