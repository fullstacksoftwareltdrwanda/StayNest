'use client'

import React from 'react'
import { Skeleton } from '@/components/shared/SkeletonLoader'

export default function PropertyDetailsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32">
      {/* ─── Header Skeleton ─────────────────────── */}
      <section className="bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 sm:mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
              <Skeleton className="h-16 w-3/4 max-w-2xl rounded-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="h-6 w-64 rounded-full" />
              </div>
            </div>
          </div>

          <Skeleton className="aspect-[16/10] sm:aspect-[21/9] w-full rounded-[2.5rem] sm:rounded-[3.5rem]" />
        </div>
      </section>

      {/* ─── Content Skeleton ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 mt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-5/6 rounded-full" />
              <Skeleton className="h-4 w-4/6 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-96">
            <Skeleton className="h-[400px] w-full rounded-[2.5rem] shadow-xl" />
          </div>
        </div>

        <div className="pt-24 border-t border-[var(--warm-gray)]">
          <Skeleton className="h-8 w-48 mb-12 rounded-full" />
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
