'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'
import { createProperty } from '@/lib/properties/createProperty'
import { updateProperty } from '@/lib/properties/updateProperty'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'
import { PropertyImageUpload } from './PropertyImageUpload'
import { Loader2 } from 'lucide-react'

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePropertyInput>({
    name: property?.name || '',
    type: property?.type || 'Hotel',
    description: property?.description || '',
    country: property?.country || '',
    city: property?.city || '',
    address: property?.address || '',
    main_image_url: property?.main_image_url || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'number' && value === '' ? '' : (type === 'number' ? parseFloat(value) : value)
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, main_image_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (property) {
        await updateProperty(property.id, formData as UpdatePropertyInput)
      } else {
        await createProperty(formData)
      }
      router.push('/owner/properties')
      router.refresh()
    } catch (error) {
      console.error('Error saving property:', error)
      alert('Error saving property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer 
      title={property ? 'Edit Property' : 'List Your Property'} 
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <PropertyImageUpload 
          onUpload={handleImageUpload} 
          currentImageUrl={formData.main_image_url} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Property Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Grand View Resort"
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            >
              <option value="Hotel">Hotel</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Resort">Resort</option>
              <option value="Guesthouse">Guesthouse</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell travelers what makes your place special..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm h-32 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. Rwanda"
            required
          />
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Kigali"
            required
          />
        </div>

        <Input
          label="Detailed Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. KN 3 Rd, Kigali"
          required
        />

        <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            property ? 'Update Property' : 'List Property Now'
          )}
        </Button>
      </div>
    </FormContainer>
  )
}
