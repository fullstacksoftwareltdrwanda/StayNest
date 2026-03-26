'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateReviewInput } from '@/types/review'
import { canUserReviewBooking } from './canUserReviewBooking'

import { createNotification } from '@/lib/notifications/createNotification'

export async function createReview(input: CreateReviewInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Double check eligibility
  const { canReview, error, property } = await canUserReviewBooking(input.booking_id)
  if (!canReview) throw new Error(error)

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
    throw insertError
  }

  // Create notification for the user
  await createNotification({
    user_id: user.id,
    title: 'Review Posted!',
    message: `Your review for ${property?.name || 'the property'} has been successfully posted.`,
    type: 'review'
  })

  // Notify the owner
  const { data: propertyData } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', input.property_id)
    .single()

  if (propertyData?.owner_id) {
    await createNotification({
      user_id: propertyData.owner_id,
      title: 'New Review Received',
      message: `A guest left a ${input.rating}-star review for ${property?.name || 'your property'}.`,
      type: 'review'
    })
  }

  return data
}
