'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { isAdmin } from '@/lib/auth/access'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function getPlatformProperties(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            full_name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return properties.map(p => {
      const plain = JSON.parse(JSON.stringify(p))
      return {
        ...plain,
        daily_price: p.daily_price ? Number(p.daily_price) : null,
        monthly_price: p.monthly_price ? Number(p.monthly_price) : null,
        latitude: p.latitude ? Number(p.latitude) : null,
        longitude: p.longitude ? Number(p.longitude) : null,
      }
    }) as any
  } catch (error) {
    console.error('Error fetching platform properties:', error)
    return []
  }
}

export async function approveProperty(propertyId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { owner_id: true, name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'approved' }
    })

    // Notify owner
    await createNotification({
      user_id: property.owner_id,
      type: 'property_approved',
      title: 'Property Approved!',
      message: `Congratulations! Your property "${property.name}" has been approved and is now live on UrugoStay.`,
      link: `/owner/properties/${propertyId}`
    })

    revalidatePath('/admin/properties')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/owner/properties/${propertyId}`)
    revalidatePath('/')
  } catch (error) {
    console.error('APPROVE PROPERTY ERROR:', error)
    throw error
  }
}

export async function rejectProperty(propertyId: string, reason?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { owner_id: true, name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'rejected' }
    })

    // Notify owner
    await createNotification({
      user_id: property.owner_id,
      type: 'property_rejected',
      title: 'Property Listing Update',
      message: `Your property "${property.name}" request was not approved. ${reason ? `Reason: ${reason}` : 'Please review your listing and try again.'}`,
      link: `/owner/properties/${propertyId}/edit`
    })

    revalidatePath('/admin/properties')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/owner/properties/${propertyId}`)
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/')
  } catch (error) {
    console.error('REJECT PROPERTY ERROR:', error)
    throw error
  }
}

export async function deleteProperty(propertyId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.delete({
      where: { id: propertyId }
    })

    const paths = ['/admin/properties', '/admin/dashboard', '/search', '/']
    paths.forEach(path => revalidatePath(path))
    
    return { success: true, message: `Property "${property.name}" and all its associated data have been wiped.` }
  } catch (error) {
    console.error('DELETE PROPERTY ERROR:', error)
    throw new Error('Failed to delete property')
  }
}

export async function getPlatformUsers() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const users = await prisma.profile.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        avatar_url: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return users
  } catch (error) {
    console.error('Error fetching platform users:', error)
    return []
  }
}

export async function updateUserRole(userId: string, role: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { role }
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/dashboard')
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

export async function getPublicPlatformAnalytics() {
  try {
    const [totalUsers, totalProperties, reviewStats] = await Promise.all([
      prisma.profile.count(),
      prisma.property.count({ where: { status: 'approved' } }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ])

    return {
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      averageRating: reviewStats._avg.rating || 5.0
    }
  } catch (error) {
    console.error('Error fetching public analytics:', error)
    return {
      totalUsers: 0,
      totalProperties: 0,
      averageRating: 5.0
    }
  }
}

export async function getPlatformAnalytics() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const [
      totalUsers,
      totalProperties,
      approvedCount,
      totalBookings,
      totalReviews,
      paymentStats,
      reviewStats,
      ownerCount,
      adminCount
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: 'approved' } }),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true
        }
      }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      }),
      prisma.profile.count({ where: { role: 'owner' } }),
      prisma.profile.count({ where: { role: 'admin' } })
    ])

    return {
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      approvedProperties: approvedCount || 0,
      totalBookings: totalBookings || 0,
      totalReviews: totalReviews || 0,
      totalRevenue: Number(paymentStats._sum.amount || 0),
      averageRating: reviewStats._avg.rating || 0,
      totalOwners: ownerCount || 0,
      totalAdmins: adminCount || 0
    }
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    throw error
  }
}

export async function getPlatformFinancialReport() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    // 1. Get all payments
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            property: {
              select: {
                name: true,
                city: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // 2. Aggregate by month
    const monthlyRevenue: Record<string, number> = {}
    payments.forEach(p => {
      const month = format(new Date(p.created_at), 'MMM yyyy')
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(p.amount)
    })

    // 3. Top earning properties
    const propertyEarnings: Record<string, number> = {}
    payments.forEach(p => {
      const name = p.booking?.property?.name || 'Unknown'
      propertyEarnings[name] = (propertyEarnings[name] || 0) + Number(p.amount)
    })

    return {
      payments: payments.map(p => ({ ...p, amount: Number(p.amount) })),
      monthlyRevenue,
      topProperties: Object.entries(propertyEarnings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    }
  } catch (error) {
    console.error('Error fetching financial report:', error)
    throw error
  }
}

export async function getPlatformBookings(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true
          }
        },
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            main_image_url: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return bookings.map(b => ({
      ...b,
      total_price: Number(b.total_price),
      guest: b.user // Rename for compatibility
    })) as any
  } catch (error) {
    console.error('Error fetching platform bookings:', error)
    return []
  }
}

export async function getPlatformPayments(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        booking: {
          select: {
            id: true,
            check_in: true,
            check_out: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return payments.map(p => ({
      ...p,
      amount: Number(p.amount)
    })) as any
  } catch (error) {
    console.error('Error fetching platform payments:', error)
    return []
  }
}

export async function getPlatformReviews() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        property: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return reviews
  } catch (error) {
    console.error('Error fetching platform reviews:', error)
    return []
  }
}

export async function deleteReview(reviewId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.review.delete({ where: { id: reviewId } })
    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

export async function cancelBooking(bookingId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: { select: { name: true } },
        user: { select: { id: true, full_name: true } }
      }
    })
    if (!booking) throw new Error('Booking not found')

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    })

    await createNotification({
      user_id: booking.user_id,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.property?.name || 'a property'} has been cancelled by an administrator.`,
      type: 'booking'
    })

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/bookings')
    return { success: true }
  } catch (error) {
    console.error('CANCEL BOOKING ERROR:', error)
    throw error
  }
}

export async function suspendUser(userId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { status: 'suspended' }
    })
    revalidatePath('/admin/users')
  } catch (error) {
    console.error('Error suspending user:', error)
    throw error
  }
}

export async function unsuspendUser(userId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { status: null }
    })
    revalidatePath('/admin/users')
  } catch (error) {
    console.error('Error unsuspending user:', error)
    throw error
  }
}

// ─── Dashboard Chart Data ──────────────────────────────────────────────────

export interface MonthlyPoint {
  month: string   // "Jan 24"
  revenue: number
  bookings: number
  users: number
}

export interface StatusBreakdown {
  name: string
  value: number
  color: string
}

export interface DashboardChartData {
  monthly: MonthlyPoint[]
  propertyStatus: StatusBreakdown[]
  bookingStatus: StatusBreakdown[]
  paymentStatus: StatusBreakdown[]
  topProperties: { name: string; revenue: number; bookings: number }[]
  recentBookings: {
    id: string
    property: string
    guest: string
    amount: number
    status: string
    check_in: string
    check_out: string
    created_at: string
    pricing_unit: string
  }[]
}

export async function getDashboardChartData(): Promise<DashboardChartData> {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const now = new Date()
  const twelveMonthsAgo = subMonths(startOfMonth(now), 11)

  // Fetch raw time-series data (last 12 months)
  const [rawPayments, rawBookings, rawProfiles, propertyStatuses, bookingStatuses, paymentStatuses, allPropertyPayments, latestBookings] = await Promise.all([
    // Payments in last 12 months
    prisma.payment.findMany({
      where: { created_at: { gte: twelveMonthsAgo } },
      select: { amount: true, status: true, created_at: true }
    }),
    // Bookings in last 12 months
    prisma.booking.findMany({
      where: { created_at: { gte: twelveMonthsAgo } },
      select: { id: true, status: true, created_at: true }
    }),
    // New users in last 12 months
    prisma.profile.findMany({
      where: { created_at: { gte: twelveMonthsAgo } },
      select: { id: true, created_at: true }
    }),
    // Property status counts
    prisma.property.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    // Booking status counts (all time)
    prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    // Payment status counts
    prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    // All payments with property for top properties
    prisma.payment.findMany({
      where: { status: 'paid' },
      select: {
        amount: true,
        booking: {
          select: {
            property: { select: { id: true, name: true } }
          }
        }
      }
    }),
    // 10 most recent bookings with context
    prisma.booking.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        property: { select: { name: true } },
        user: { select: { full_name: true } },
        payment: { select: { amount: true } }
      }
    })
  ])

  // ── Build monthly time-series (last 12 months, filled gaps) ──────────────
  const monthly: MonthlyPoint[] = []
  for (let i = 11; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i))
    const monthEnd = endOfMonth(monthStart)
    const label = format(monthStart, 'MMM yy')

    const revenue = rawPayments
      .filter(p => p.status === 'paid' && new Date(p.created_at) >= monthStart && new Date(p.created_at) <= monthEnd)
      .reduce((sum, p) => sum + Number(p.amount), 0)

    const bookingsCount = rawBookings
      .filter(b => new Date(b.created_at) >= monthStart && new Date(b.created_at) <= monthEnd)
      .length

    const usersCount = rawProfiles
      .filter(u => new Date(u.created_at) >= monthStart && new Date(u.created_at) <= monthEnd)
      .length

    monthly.push({ month: label, revenue: Math.round(revenue), bookings: bookingsCount, users: usersCount })
  }

  // ── Property status breakdown ─────────────────────────────────────────────
  const PROP_COLORS: Record<string, string> = {
    approved: '#10b981',
    pending:  '#f59e0b',
    rejected: '#ef4444',
    draft:    '#94a3b8',
  }
  const propertyStatus: StatusBreakdown[] = propertyStatuses.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s._count.id,
    color: PROP_COLORS[s.status] || '#94a3b8'
  }))

  // ── Booking status breakdown ──────────────────────────────────────────────
  const BOOKING_COLORS: Record<string, string> = {
    confirmed: '#10b981',
    pending:   '#f59e0b',
    cancelled: '#ef4444',
    completed: '#6366f1',
  }
  const bookingStatus: StatusBreakdown[] = bookingStatuses.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s._count.id,
    color: BOOKING_COLORS[s.status] || '#94a3b8'
  }))

  // ── Payment status breakdown ──────────────────────────────────────────────
  const PAY_COLORS: Record<string, string> = {
    paid:    '#10b981',
    pending: '#f59e0b',
    failed:  '#ef4444',
  }
  const paymentStatus: StatusBreakdown[] = paymentStatuses.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s._count.id,
    color: PAY_COLORS[s.status] || '#94a3b8'
  }))

  // ── Top properties by revenue ─────────────────────────────────────────────
  const propMap: Record<string, { name: string; revenue: number; bookings: number }> = {}
  allPropertyPayments.forEach(p => {
    const id = p.booking?.property?.id || 'unknown'
    const name = p.booking?.property?.name || 'Unknown'
    if (!propMap[id]) propMap[id] = { name, revenue: 0, bookings: 0 }
    propMap[id].revenue += Number(p.amount)
    propMap[id].bookings += 1
  })
  const topProperties = Object.values(propMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7)
    .map(p => ({ ...p, revenue: Math.round(p.revenue) }))

  // ── Recent bookings feed ───────────────────────────────────────────────────
  const recentBookings = latestBookings.map(b => ({
    id: b.id,
    property: b.property?.name || 'Unknown',
    guest: b.user?.full_name || 'Guest',
    amount: Number(b.payment?.amount || b.total_price),
    status: b.status,
    check_in: b.check_in.toISOString(),
    check_out: b.check_out.toISOString(),
    created_at: b.created_at.toISOString(),
    pricing_unit: b.pricing_unit,
  }))

  return { monthly, propertyStatus, bookingStatus, paymentStatus, topProperties, recentBookings }
}

