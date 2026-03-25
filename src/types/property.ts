export type PropertyStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  description: string;
  country: string;
  city: string;
  address: string;
  main_image_url?: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export type CreatePropertyInput = Omit<Property, 'id' | 'owner_id' | 'status' | 'created_at' | 'updated_at'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput> & { status?: PropertyStatus };
