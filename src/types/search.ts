export interface SearchFilters {
  destination?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface PropertySearchResult {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  city: string;
  country: string;
  main_image_url: string | null;
  starting_price: number | null;
  capacity: number;
  average_rating: number | null;
  review_count: number;
  is_favorited?: boolean;
}
