import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerReviews } from '@/lib/reviews/getOwnerReviews'
import { PageHeader } from '@/components/shared/page-header'
import { MessageSquare, Star, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default async function OwnerReviewsPage() {
  await requireRole(['owner', 'admin'])
  const reviews = await getOwnerReviews()

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Guest Reviews"
          subtitle="See what guests are saying about your properties."
        />

        <div className="grid grid-cols-1 gap-4">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:shadow-black/[0.03] transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm font-black text-gray-900">{review.rating}.0</span>
                    </div>

                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Property</h4>
                    <p className="text-lg font-black text-gray-900 mb-4">{review.property?.name}</p>
                    
                    <p className="text-gray-600 font-medium leading-relaxed italic pr-8">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="md:w-64 flex-shrink-0">
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 h-full">
                       <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-[var(--primary)] shadow-sm overflow-hidden">
                            {review.user?.avatar_url ? (
                              <img src={review.user.avatar_url} alt="Guest" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 leading-none">{review.user?.full_name}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">Verified Guest</p>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-gray-200/50">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Received on</p>
                         <p className="text-xs font-bold text-gray-500">{format(parseISO(review.created_at), 'MMMM dd, yyyy')}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-14 px-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare className="w-7 h-7 text-gray-200" />
               </div>
               <h3 className="text-base font-black text-gray-900 mb-1 tracking-tight">No reviews yet</h3>
               <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">When guests leave feedback for your properties, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
