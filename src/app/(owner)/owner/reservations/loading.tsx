export default function ReservationsLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
