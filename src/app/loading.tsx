'use client'

import React from 'react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 rounded-full blur-[120px] animate-pulse" />

      <div className="relative">
        {/* Logo/Spinner Container */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-10 group">
          {/* Animated Rings */}
          <div className="absolute inset-0 rounded-[2.5rem] border-4 border-[var(--primary)]/10 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 rounded-[2rem] border-4 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute inset-4 rounded-[1.5rem] border-4 border-b-[var(--primary)] border-t-transparent border-r-transparent border-l-transparent animate-[spin_2s_linear_infinite_reverse]" />
          
          {/* Central Logo Placeholder (U) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black text-[var(--primary)] tracking-tighter italic animate-pulse">U</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.5em] animate-pulse">
            Loading Excellence
          </h2>
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent w-full animate-[loading_2s_infinite_ease-out]" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            StayNest &bull; Rwanda
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
