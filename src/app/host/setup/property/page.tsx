'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/shared/Button'
import {
  Home,
  MapPin,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Hotel,
  Building2,
  Palmtree,
  Coffee,
  Check,
  DollarSign,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Wind,
  Utensils,
  Tv,
  WashingMachine,
  PlusCircle,
  X,
  LayoutGrid,
  Calendar,
  Clock,
  Briefcase,
  BedDouble,
  House,
  Loader2,
  ShieldCheck,
  Dog,
  Cigarette,
  Camera,
  Music,
  MoonStar,
  ClockIcon
} from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { createProperty, getHostProfile } from './actions'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/shared/Input'
import { toast } from 'sonner'
import { MultiImageUpload } from '@/components/shared/MultiImageUpload'
import { HouseRules } from '@/types/property'

const MapView = dynamic(() => import('@/components/maps/map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 animate-pulse flex items-center justify-center rounded-[2.5rem]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Initializing Map...</span>
      </div>
    </div>
  )
})
const MapMarker = dynamic(() => import('@/components/maps/map-marker'), { ssr: false })

import { useMapEvents } from 'react-leaflet'
function MapLocationPicker({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onLocationSelected(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

const steps = [
  { id: 1, title: 'Category',  icon: Home,         desc: 'What kind of place?' },
  { id: 2, title: 'Location',  icon: MapPin,        desc: 'Where is it?' },
  { id: 3, title: 'Amenities', icon: Coffee,        desc: 'Features & rules' },
  { id: 4, title: 'Photos',    icon: UploadCloud,   desc: 'Show it off' },
  { id: 5, title: 'Publish',   icon: CheckCircle2,  desc: 'Ready to earn' },
]

const PROPERTY_TYPES = [
  { id: 'Hotel',      label: 'Hotel',      icon: Hotel,     defaultHourly: false, defaultWhole: false },
  { id: 'Apartment',  label: 'Apartment',  icon: Building2, defaultHourly: false, defaultWhole: true  },
  { id: 'Villa',      label: 'Villa',      icon: Palmtree,  defaultHourly: false, defaultWhole: true  },
  { id: 'Guesthouse', label: 'Guesthouse', icon: Home,      defaultHourly: false, defaultWhole: false },
  { id: 'Office',     label: 'Office',     icon: Briefcase, defaultHourly: true,  defaultWhole: true  },
  { id: 'Room',       label: 'Room',       icon: BedDouble, defaultHourly: false, defaultWhole: true  },
  { id: 'House',      label: 'House',      icon: House,     defaultHourly: false, defaultWhole: true  },
  { id: 'Other',      label: 'Other',      icon: Sparkles,  defaultHourly: false, defaultWhole: true  },
]

const STANDARD_AMENITIES = [
  { id: 'wifi',    label: 'High-speed WiFi',  icon: 'Wifi' },
  { id: 'parking', label: 'Free Parking',     icon: 'Car' },
  { id: 'pool',    label: 'Swimming Pool',    icon: 'Waves' },
  { id: 'gym',     label: 'Fitness Center',   icon: 'Dumbbell' },
  { id: 'ac',      label: 'Air Conditioning', icon: 'Wind' },
  { id: 'kitchen', label: 'Full Kitchen',     icon: 'Utensils' },
  { id: 'tv',      label: 'Smart TV',         icon: 'Tv' },
  { id: 'washer',  label: 'Washer / Dryer',   icon: 'WashingMachine' },
]

const DEFAULT_HOUSE_RULES: HouseRules = {
  pets_allowed: false,
  smoking_allowed: false,
  parties_allowed: false,
  cameras_on_premises: false,
  quiet_hours: false,
  check_in_from: '14:00',
  check_out_by: '11:00',
  additional_rules: '',
}

export default function HostPropertySetupPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyDraft, setPropertyDraft] = useState({
    name: '',
    type: 'Apartment',
    description: '',
    city: 'Kigali',
    country: 'Rwanda',
    address: '',
    latitude: -1.9441,
    longitude: 30.0619,
    daily_price: 100,
    hourly_price: 25,
    monthly_price: 0,
    amenities: [] as string[],
    images: [] as string[],
    main_image_url: '' as string,
    is_whole_unit: true,
    offers_daily: true,
    offers_monthly: false,
    offers_hourly: false,
    max_guests: 1 as number | '',
    house_rules: { ...DEFAULT_HOUSE_RULES },
    hosting_business_name: '',
    bio: '',
    payout_method: 'none' as 'stripe' | 'momo' | 'none',
    payout_momo_number: '',
    payout_momo_provider: 'mtn' as 'mtn' | 'airtel',
    stripe_connect_id: ''
  })
  const [customAmenityInput, setCustomAmenityInput] = useState('')
  const [customType, setCustomType] = useState('')
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)

  const router = useRouter()
  const { setHostMode } = useSettings()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/host/setup/property')
  }, [status, router])

  useEffect(() => {
    const checkInitialState = async () => {
      if (session?.user) {
        const profile = await getHostProfile()
        if (profile) {
          setPropertyDraft(prev => ({
            ...prev,
            hosting_business_name: profile.hosting_business_name || prev.hosting_business_name,
            bio: profile.bio || prev.bio,
            payout_method: (profile.payout_method as any) || prev.payout_method,
            payout_momo_number: profile.payout_momo_number || prev.payout_momo_number,
            payout_momo_provider: (profile.payout_momo_provider as any) || prev.payout_momo_provider,
            stripe_connect_id: profile.stripe_connect_id || ''
          }))
        }
      }
    }
    checkInitialState()

    const success = searchParams.get('success')
    const step = searchParams.get('step')
    if (success === 'true' && step === '5') {
      setCurrentStep(5)
      toast.success('Stripe account connected successfully!')
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    )
  }

  const handleAddressSearch = async () => {
    if (!propertyDraft.address.trim()) { toast.error('Please enter a street address first.'); return }
    setIsSearchingLocation(true)
    try {
      const query = `${propertyDraft.address}, ${propertyDraft.city}, Rwanda`
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'StayNest-Host-Onboarding' } }
      )
      const data = await response.json()
      if (data?.length > 0) {
        setPropertyDraft(prev => ({ ...prev, latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }))
        toast.success('Location found!')
      } else {
        toast.error('Location not found', { description: 'Try adding more detail or pin manually.' })
      }
    } catch {
      toast.error('Search failed. Please try pinning manually.')
    } finally {
      setIsSearchingLocation(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (propertyDraft.type === 'Other' && !customType.trim()) {
        toast.error('Please specify what type of property it is.')
        return
      }
    } else if (currentStep === 2) {
      if (!propertyDraft.city.trim() || !propertyDraft.address.trim()) {
        toast.error('Please provide a valid city and address.')
        return
      }
      if (propertyDraft.address.length < 5) {
        toast.error('Please provide a more detailed address.')
        return
      }
    } else if (currentStep === 4) {
      if (!propertyDraft.name.trim() || !propertyDraft.description.trim()) {
        toast.error('Please provide a title and description.')
        return
      }
      if (propertyDraft.images.length < 2) {
        toast.error('Please upload at least 2 photos.')
        return
      }
    }
    setCurrentStep(prev => Math.min(steps.length, prev + 1))
  }

  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1))

  const handleComplete = async () => {
    const needsPrice = propertyDraft.offers_daily || propertyDraft.offers_monthly || propertyDraft.offers_hourly
    if (!needsPrice) {
      toast.error('Please enable at least one pricing option.')
      return
    }
    if (propertyDraft.offers_daily && (!propertyDraft.daily_price || propertyDraft.daily_price <= 0)) {
      toast.error('Please set a valid daily rate.')
      return
    }
    if (propertyDraft.offers_hourly && (!propertyDraft.hourly_price || propertyDraft.hourly_price <= 0)) {
      toast.error('Please set a valid hourly rate.')
      return
    }

    setIsSubmitting(true)
    try {
      if (!session?.user) { router.push('/login?redirect=/host/onboarding'); return }
      const finalType = propertyDraft.type === 'Other' ? customType : propertyDraft.type
      const result = await createProperty({
        ...propertyDraft,
        max_guests: propertyDraft.max_guests === '' ? 1 : Number(propertyDraft.max_guests),
        type: finalType,
        house_rules: propertyDraft.house_rules
      })
      if (!result.success) throw new Error('Failed to create property')
      setHostMode(true)
      toast.success('Listing submitted for review!')
      router.push('/owner/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateHouseRule = (key: keyof HouseRules, value: any) => {
    setPropertyDraft(prev => ({
      ...prev,
      house_rules: { ...prev.house_rules, [key]: value }
    }))
  }

  const RULE_TOGGLES = [
    { key: 'pets_allowed',        label: 'Pets Allowed',             desc: 'Dogs, cats, etc.',          icon: Dog },
    { key: 'smoking_allowed',     label: 'Smoking Allowed',          desc: 'Cigarettes / vaping',       icon: Cigarette },
    { key: 'parties_allowed',     label: 'Events & Parties',         desc: 'Gatherings allowed',        icon: Music },
    { key: 'cameras_on_premises', label: 'Security Cameras',         desc: 'On/around property',        icon: Camera },
    { key: 'quiet_hours',         label: 'Quiet Hours Apply',        desc: 'Noise rules in effect',     icon: MoonStar },
  ] as const

  // Determine if "whole unit" is forced
  const forceHotelStyle = ['Hotel', 'Guesthouse'].includes(propertyDraft.type)
  const forceWholeUnit  = ['Apartment', 'Villa', 'Room', 'House', 'Office'].includes(propertyDraft.type)

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-screen">
      {/* ─── Wizard Header ──────────────────────── */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Become a Host</h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {steps[currentStep - 1].title} — {steps[currentStep - 1].desc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-8 h-1.5 sm:w-16 sm:h-2 rounded-full transition-all duration-500 ${currentStep >= step.id ? 'bg-[var(--primary)]' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 flex flex-col items-center">

          {/* ─── STEP 1: CATEGORY ─── */}
          {currentStep === 1 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] mx-auto border border-[var(--primary)]/10 shadow-xl shadow-black/5">
                  <Home className="w-10 h-10" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  What type of <span className="text-[var(--primary)]">place</span> is it?
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-md mx-auto">
                  Choose the category that best describes your space.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                {PROPERTY_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPropertyDraft(prev => ({
                      ...prev,
                      type: item.id,
                      is_whole_unit: item.defaultWhole,
                      offers_hourly: item.defaultHourly,
                      offers_daily: !item.defaultHourly,
                    }))}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 group ${
                      propertyDraft.type === item.id
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-xl shadow-[var(--primary)]/5'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      propertyDraft.type === item.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-center ${
                      propertyDraft.type === item.id ? 'text-[var(--primary)]' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                    {item.defaultHourly && (
                      <span className="text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
                        Hourly
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {propertyDraft.type === 'Other' && (
                <div className="max-w-md mx-auto mt-6 animate-fade-in-up">
                  <Input
                    label="Specify Property Type"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Treehouse, Studio, Co-working Space..."
                    className="h-14 rounded-2xl bg-gray-50"
                  />
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 2: LOCATION ─── */}
          {currentStep === 2 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  Where is it <span className="text-[var(--primary)]">located?</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg">Pin your exact location on the map.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    value={propertyDraft.city}
                    onChange={(e) => setPropertyDraft(prev => ({ ...prev, city: e.target.value }))}
                    className="h-14 rounded-2xl bg-gray-50"
                  />
                  <div className="relative">
                    <Input
                      label="Street Address"
                      placeholder="e.g. KN 2 St, Kiyovu"
                      value={propertyDraft.address}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, address: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                      className="h-16 rounded-2xl bg-gray-50 text-base font-bold pr-36"
                    />
                    <button
                      onClick={handleAddressSearch}
                      disabled={isSearchingLocation}
                      className="absolute right-3 top-[34px] bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isSearchingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3 text-[var(--accent)]" />}
                      <span>Find</span>
                    </button>
                  </div>
                </div>

                <div className="h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl relative">
                  <MapView center={[propertyDraft.latitude, propertyDraft.longitude]} zoom={15} className="z-0">
                    <MapLocationPicker
                      onLocationSelected={(lat, lng) => {
                        setPropertyDraft(prev => ({ ...prev, latitude: lat, longitude: lng }))
                        toast.success('Location pinned!')
                      }}
                    />
                    <MapMarker
                      position={[propertyDraft.latitude, propertyDraft.longitude]}
                      title="Your Property"
                      draggable={true}
                      onDragEnd={(lat, lng) => {
                        setPropertyDraft(prev => ({ ...prev, latitude: lat, longitude: lng }))
                        toast.success('Pin moved')
                      }}
                    />
                  </MapView>
                  <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                      <span className="text-[9px] font-black uppercase text-gray-900 tracking-widest">Interactive Picker</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: AMENITIES & HOUSE RULES ─── */}
          {currentStep === 3 && (
            <div className="w-full space-y-14 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  Features &amp; <span className="text-[var(--primary)]">Rules.</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg">What makes your place special — and what guests should know.</p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STANDARD_AMENITIES.map((amenity) => {
                    const Icon = { Wifi, Car, Waves, Dumbbell, Wind, Utensils, Tv, WashingMachine }[amenity.icon] as any
                    const isSelected = propertyDraft.amenities.includes(amenity.id)
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          setPropertyDraft(prev => ({
                            ...prev,
                            amenities: isSelected
                              ? prev.amenities.filter(a => a !== amenity.id)
                              : [...prev.amenities, amenity.id]
                          }))
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                            : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-100 hover:bg-white hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{amenity.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Custom Amenities */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <Input
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!customAmenityInput.trim()) return
                          const newAmenity = customAmenityInput.trim()
                          if (!propertyDraft.amenities.includes(newAmenity)) {
                            setPropertyDraft(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }))
                          }
                          setCustomAmenityInput('')
                        }
                      }}
                      placeholder="e.g. Private Chef, Helipad, Rooftop Terrace..."
                      className="flex-1 h-12 rounded-2xl bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        if (!customAmenityInput.trim()) return
                        const newAmenity = customAmenityInput.trim()
                        if (!propertyDraft.amenities.includes(newAmenity)) {
                          setPropertyDraft(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }))
                        }
                        setCustomAmenityInput('')
                      }}
                      className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors shrink-0"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {propertyDraft.amenities.filter(a => !STANDARD_AMENITIES.find(s => s.id === a)).map((amenity) => (
                      <span key={amenity} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200">
                        {amenity}
                        <button onClick={() => setPropertyDraft(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }))} className="hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">House Rules &amp; Policies</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Let guests know what's allowed on your property</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RULE_TOGGLES.map(({ key, label, desc, icon: Icon }) => {
                    const isOn = propertyDraft.house_rules[key] as boolean
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateHouseRule(key, !isOn)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          isOn
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOn ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-black uppercase tracking-widest ${isOn ? 'text-emerald-800' : 'text-gray-700'}`}>{label}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{desc}</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${isOn ? 'bg-emerald-400' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Check-in / Check-out times */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ClockIcon className="w-3 h-3" /> Check-in From
                    </label>
                    <input
                      type="time"
                      value={propertyDraft.house_rules.check_in_from || '14:00'}
                      onChange={(e) => updateHouseRule('check_in_from', e.target.value)}
                      className="w-full h-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ClockIcon className="w-3 h-3" /> Check-out By
                    </label>
                    <input
                      type="time"
                      value={propertyDraft.house_rules.check_out_by || '11:00'}
                      onChange={(e) => updateHouseRule('check_out_by', e.target.value)}
                      className="w-full h-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                </div>

                {/* Additional rules */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Rules (optional)</label>
                  <textarea
                    rows={3}
                    value={propertyDraft.house_rules.additional_rules || ''}
                    onChange={(e) => updateHouseRule('additional_rules', e.target.value)}
                    placeholder="e.g. No shoes indoors. Guests must register at reception. Curfew at midnight..."
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: DETAILS & PHOTOS ─── */}
          {currentStep === 4 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  Fine <span className="text-[var(--primary)]">Details.</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg">Title and describe your space.</p>
              </div>

              <div className="space-y-8">
                <Input
                  label="Property Title"
                  placeholder="e.g. Luxury Penthouse with City View"
                  value={propertyDraft.name}
                  onChange={(e) => setPropertyDraft(prev => ({ ...prev, name: e.target.value }))}
                  className="h-16 rounded-2xl bg-gray-50 text-xl font-bold"
                />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">About the place</label>
                  <textarea
                    rows={6}
                    value={propertyDraft.description}
                    onChange={(e) => setPropertyDraft(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell guests what's unique about your space..."
                    className="w-full p-6 bg-gray-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-gray-900 font-medium leading-relaxed"
                  />
                </div>
                <MultiImageUpload
                  bucket="property-images"
                  label="Property Photos"
                  minImages={2}
                  initialImages={propertyDraft.images}
                  onUpload={(urls) => setPropertyDraft(prev => ({ ...prev, images: urls, main_image_url: urls[0] || '' }))}
                />
              </div>
            </div>
          )}

          {/* ─── STEP 5: PRICING & PUBLISH ─── */}
          {currentStep === 5 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  Final <span className="text-[var(--accent)] italic">Step.</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg">Set your pricing strategy.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-10">
                {/* Listing Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Architecture</label>
                    <div className="flex p-1 bg-white border border-gray-200 rounded-2xl">
                      <button
                        type="button"
                        disabled={forceHotelStyle}
                        onClick={() => setPropertyDraft(prev => ({ ...prev, is_whole_unit: false }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                          !propertyDraft.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        } ${forceWholeUnit ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Multi-Room</span>
                      </button>
                      <button
                        type="button"
                        disabled={forceHotelStyle}
                        onClick={() => setPropertyDraft(prev => ({ ...prev, is_whole_unit: true }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                          propertyDraft.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        } ${forceHotelStyle ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <Home className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Whole Unit</span>
                      </button>
                    </div>
                  </div>

                  {/* Rental Options */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pricing Options</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'offers_daily',   label: 'Daily',   icon: Calendar },
                        { key: 'offers_hourly',  label: 'Hourly',  icon: Clock },
                        { key: 'offers_monthly', label: 'Monthly', icon: Calendar },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPropertyDraft(prev => ({ ...prev, [key]: !(prev as any)[key] }))}
                          className={`flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-2xl border-2 transition-all ${
                            (propertyDraft as any)[key]
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                              : 'border-gray-50 bg-gray-50 text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Inputs */}
                <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propertyDraft.offers_daily && (
                    <Input
                      label="Daily Rate (USD)"
                      type="number"
                      value={propertyDraft.daily_price || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, daily_price: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 80"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                  {propertyDraft.offers_hourly && (
                    <Input
                      label="Hourly Rate (USD)"
                      type="number"
                      value={propertyDraft.hourly_price || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, hourly_price: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 25"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                  {propertyDraft.offers_monthly && (
                    <Input
                      label="Monthly Rate (USD)"
                      type="number"
                      value={propertyDraft.monthly_price || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, monthly_price: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 2000"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                  {propertyDraft.is_whole_unit && (
                    <Input
                      label="Max Guests"
                      type="number"
                      value={propertyDraft.max_guests || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, max_guests: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) }))}
                      placeholder="e.g. 4"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                </div>

                {/* Pricing preview */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pricing Summary</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {propertyDraft.offers_daily && propertyDraft.daily_price > 0 && (
                      <span className="px-3 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/20 rounded-xl text-xs font-bold">
                        ${propertyDraft.daily_price} / night
                      </span>
                    )}
                    {propertyDraft.offers_hourly && propertyDraft.hourly_price > 0 && (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold">
                        ${propertyDraft.hourly_price} / hr
                      </span>
                    )}
                    {propertyDraft.offers_monthly && propertyDraft.monthly_price > 0 && (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                        ${propertyDraft.monthly_price} / mo
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900 mb-1">You're ready to host!</h4>
                    <p className="text-sm text-emerald-700 font-medium leading-relaxed opacity-80">
                      {propertyDraft.name || 'Your property'} will be submitted for a quick review by our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Sidebar ──────────────────── */}
        <aside className="hidden lg:block space-y-6 sticky top-32">
          <div className="p-8 rounded-[2.5rem] bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Expert Guidance</span>
              </div>
              <p className="text-sm font-medium text-white/70 leading-relaxed">
                {currentStep === 1 ? 'Offices and co-working spaces can now be listed with hourly pricing — perfect for freelancers and teams.' :
                  currentStep === 2 ? 'Privacy is our priority. Your exact address is only revealed to guests after booking is confirmed.' :
                    currentStep === 3 ? 'Properties listing cameras on premises must disclose their location to guests by law.' :
                      currentStep === 4 ? 'High-quality photos with natural light can increase bookings by up to 40%.' :
                        'Start competitive and raise your rates as 5-star reviews roll in.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Progress</h5>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                    currentStep > step.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' :
                      currentStep === step.id ? 'bg-white text-[var(--primary)] border-[var(--primary)] shadow-sm' :
                        'bg-white text-gray-300 border-gray-100'
                  }`}>
                    {currentStep > step.id ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-300'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Footer Navigation ──────────── */}
      <footer className="border-t border-gray-100 bg-white/90 backdrop-blur-xl py-6 sm:py-8 sticky bottom-0 z-40 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900 disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {Math.round((currentStep / steps.length) * 100)}% complete
            </span>
            {currentStep < steps.length ? (
              <Button
                size="lg"
                onClick={nextStep}
                className="h-14 px-10 rounded-2xl bg-gray-900 text-white hover:bg-black font-black uppercase tracking-widest group"
                rightIcon={<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="h-14 px-10 rounded-2xl bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)] hover:text-white font-black uppercase tracking-widest border-none shadow-2xl shadow-[var(--accent)]/10"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
