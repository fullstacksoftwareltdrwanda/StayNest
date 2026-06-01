export type PropertyStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type PricingUnit = 'night' | 'hour' | 'month';

export interface HouseRules {
  pets_allowed: boolean;
  smoking_allowed: boolean;
  parties_allowed: boolean;
  cameras_on_premises: boolean;
  quiet_hours: boolean;
  check_in_from?: string;
  check_out_by?: string;
  additional_rules?: string;
  [key: string]: boolean | string | undefined; // needed for Prisma Json compat
}

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  description: string;
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  main_image_url?: string;
  images?: string[];
  amenities?: string[];
  status: PropertyStatus;

  is_whole_unit: boolean;
  offers_daily: boolean;
  offers_monthly: boolean;
  offers_hourly: boolean;
  daily_price?: number;
  monthly_price?: number;
  hourly_price?: number;
  starting_price?: number | null;
  max_guests: number;
  house_rules?: HouseRules;

  host?: {
    full_name: string;
    avatar_url: string | null;
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export type CreatePropertyInput = Omit<Property, 'id' | 'owner_id' | 'status' | 'created_at' | 'updated_at'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput> & { status?: PropertyStatus };

export function getPrimaryPricingUnit(property: Pick<Property, 'offers_hourly' | 'offers_daily' | 'offers_monthly'>): PricingUnit {
  if (property.offers_hourly && !property.offers_daily && !property.offers_monthly) return 'hour';
  if (property.offers_monthly && !property.offers_daily && !property.offers_hourly) return 'month';
  return 'night';
}

export function getPricingUnitLabel(unit: PricingUnit): string {
  if (unit === 'hour') return '/ hr';
  if (unit === 'month') return '/ mo';
  return '/ night';
}
