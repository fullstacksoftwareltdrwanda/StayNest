'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateHostProfile(data: {
  full_name: string,
  phone: string,
  bio: string
}) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  try {
    const userId = session.user.id
    const userEmail = session.user.email || ''

    await prisma.user.upsert({
      where: { id: userId },
      update: { name: data.full_name, email: userEmail },
      create: { id: userId, email: userEmail, name: data.full_name }
    })

    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        full_name: data.full_name,
        email: userEmail,
        phone: data.phone,
        bio: data.bio,
        isHostOnboarded: true,
        role: 'owner'
      },
      create: {
        id: userId,
        full_name: data.full_name,
        email: userEmail,
        phone: data.phone,
        bio: data.bio,
        isHostOnboarded: true,
        role: 'owner'
      }
    })

    revalidatePath('/')
    revalidatePath('/host/onboarding')
    revalidatePath('/owner/dashboard')

    return { success: true }
  } catch (error: any) {
    console.error('updateHostProfile ERROR:', error)
    throw new Error('Failed to update host profile')
  }
}
