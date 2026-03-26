'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'
import { createProperty } from '@/lib/properties/createProperty'
import { updateProperty } from '@/lib/properties/updateProperty'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'
import { MultiImageUpload } from '@/components/shared/MultiImageUpload'
import { Loader2 } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePropertyInput>({
    name: property?.name || '',
    type: property?.type || 'Hotel',
    description: property?.description || '',
    country: property?.country || '',
    city: property?.city || '',
    address: property?.address || '',
    main_image_url: property?.main_image_url || '',
    images: property?.images || [],
  } as any)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'number' && value === '' ? '' : (type === 'number' ? parseFloat(value) : value)
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleImagesUpload = (urls: string[]) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      images: urls,
      main_image_url: urls.length > 0 ? urls[0] : '' 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.images && formData.images.length < 5) {
      alert(t('property_form.min_photos_error', { count: '5' }))
      return
    }

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
      alert(t('property_form.save_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer 
      title={property ? t('property_form.edit_title') : t('property_form.list_title')} 
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        <MultiImageUpload 
          label={t('property_form.photos_label')}
          bucket="property-images"
          initialImages={formData.images}
          onUpload={handleImagesUpload}
          minImages={5}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('property_form.name_label')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('property_form.name_placeholder')}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">{t('property_form.type_label')}</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            >
              <option value="Hotel">{t('common.property_types.hotel')}</option>
              <option value="Apartment">{t('common.property_types.apartment')}</option>
              <option value="Villa">{t('common.property_types.villa')}</option>
              <option value="Resort">{t('common.property_types.resort')}</option>
              <option value="Guesthouse">{t('common.property_types.guesthouse')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">{t('property_form.description_label')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('property_form.description_placeholder')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm h-32 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('property_form.country_label')}
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. Rwanda"
            required
          />
          <Input
            label={t('property_form.city_label')}
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Kigali"
            required
          />
        </div>

        <Input
          label={t('property_form.address_label')}
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
              {t('common.saving')}
            </>
          ) : (
            property ? t('property_form.submit_update') : t('property_form.submit_list')
          )}
        </Button>
      </div>
    </FormContainer>
  )
}
