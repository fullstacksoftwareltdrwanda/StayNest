export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 w-full bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  )
}
