'use client'

import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface PropertyImageUploadProps {
  onUpload: (url: string) => void
  currentImageUrl?: string
}

export function PropertyImageUpload({ onUpload, currentImageUrl }: PropertyImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.')
        return
      }

      // Create preview
      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `property-main-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Property Main Image</label>
      
      {preview ? (
        <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-gray-200 group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
          />
          <div className="h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors p-6 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-600">Uploading your image...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG or WebP up to 5MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
