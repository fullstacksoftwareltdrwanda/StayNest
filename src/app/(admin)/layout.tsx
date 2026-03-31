import { requireRole } from '@/lib/auth/requireRole'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Force role-based security at the layout level
  // This is safer and more reliable than doing it in middleware
  await requireRole(['admin'])

  return (
    <div className="min-h-screen bg-gray-50/50">
      {children}
    </div>
  )
}
