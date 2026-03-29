'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Home, ShieldCheck, MapPin, UploadCloud, CheckCircle2 } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { createClient } from '@/lib/supabase/client'

const steps = [
  { id: 1, title: 'Basics', icon: Home, desc: 'Tell us about your place' },
  { id: 2, title: 'Location', icon: MapPin, desc: 'Where is it located?' },
  { id: 3, title: 'Details', icon: UploadCloud, desc: 'Photos & specifics' },
  { id: 4, title: 'Verification', icon: ShieldCheck, desc: 'Safety & rules' },
]

export default function HostOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { setHostMode } = useSettings()
  const supabase = createClient()

  const handleComplete = async () => {
    setIsSubmitting(true)
    // 1. Get user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // 2. Update profile role to owner
      await supabase
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', user.id)

      // 3. Switch global state to host mode
      setHostMode(true)

      // 4. Redirect to owner dashboard to finish property creation
      router.push('/owner/dashboard')
    } else {
      router.push('/login?redirect=/host/onboarding')
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8 md:py-16">
      
      {/* Progress Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          It's easy to get started on Urugostay
        </h1>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {steps.map((step) => {
            const isActive = currentStep === step.id
            const isFinished = currentStep > step.id
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 min-w-[200px] transition-all ${
                  isActive 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                    : isFinished 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-100 bg-white opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-[var(--primary)] text-white' : isFinished ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isFinished ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-[var(--primary)]' : isFinished ? 'text-emerald-600' : 'text-gray-400'}`}>
                    Step {step.id}
                  </p>
                  <p className="text-sm font-bold text-gray-900">{step.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area (Mockup of Flow) */}
      <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 md:p-12 mb-8 min-h-[400px] flex flex-col justify-center items-center text-center">
        {currentStep === 1 && (
          <div className="max-w-md animate-fade-in">
            <Home className="w-20 h-20 text-[var(--primary)] mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">Start with the basics</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              What kind of place are you listing? We'll gather basic info first.
            </p>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="max-w-md animate-fade-in">
            <MapPin className="w-20 h-20 text-[var(--primary)] mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">Where's your place?</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Guests will only get your exact address once they've booked.
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-md animate-fade-in">
            <UploadCloud className="w-20 h-20 text-[var(--primary)] mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">Show it off</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Take photos using your phone or upload existing ones.
            </p>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-md animate-fade-in">
            <ShieldCheck className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-4">Ready to publish!</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              You're all set. Once you hit complete, you'll be switched to Host Mode and can manage your new listing immediately.
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-auto">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          className={`text-sm font-bold underline underline-offset-4 px-4 py-2 hover:text-gray-900 transition-colors ${currentStep === 1 ? 'invisible' : 'text-gray-500'}`}
        >
          Back
        </button>
        
        {currentStep < 4 ? (
          <Button 
            size="lg" 
            onClick={() => setCurrentStep(currentStep + 1)}
            className="rounded-xl px-8 py-6 text-lg font-black bg-gray-900 text-white hover:bg-black transition-all"
          >
            Next
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={handleComplete}
            disabled={isSubmitting}
            className="rounded-xl px-8 py-6 text-lg font-black bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)] hover:text-white transition-all border-none"
          >
            {isSubmitting ? 'Processing...' : 'Complete & Go to Dashboard'}
          </Button>
        )}
      </div>
    </div>
  )
}
