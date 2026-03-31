'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateReviewInput } from '@/types/review'
import { canUserReviewBooking } from './canUserReviewBooking'
import { reviewSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications/createNotification'
import { revalidatePath } from 'next/cache'

export async function createReview(input: CreateReviewInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Validation (Zod)
  const validation = reviewSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(i => i.message).join('. '))
  }

  // 2. Eligibility & Ownership Check
  const { canReview, error, property } = await canUserReviewBooking(input.booking_id)
  if (!canReview) throw new Error(error || 'You are not eligible to review this stay')

  // 3. Execution
  const { data, error: insertError } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      property_id: input.property_id,
      booking_id: input.booking_id,
      rating: input.rating,
      comment: input.comment
    })
    .select()
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
       throw new Error('You have already reviewed this stay.')
    }
    console.error('CREATE REVIEW ERROR:', insertError)
    throw new Error('Failed to post review')
  }

  // 4. Notifications
  const propertyName = (property as any)?.name || 'the property'
  
  await createNotification({
    user_id: user.id,
    title: 'Review Posted!',
    message: `Your review for ${propertyName} has been successfully posted.`,
    type: 'review'
  })

  const { data: propertyData } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', input.property_id)
    .single()

  if (propertyData?.owner_id) {
    await createNotification({
      user_id: propertyData.owner_id,
      title: 'New Review Received',
      message: `A guest left a ${input.rating}-star review for ${propertyName}.`,
      type: 'review'
    })
  }

  revalidatePath(`/properties/${input.property_id}`)
  revalidatePath('/dashboard')
  return data
}
