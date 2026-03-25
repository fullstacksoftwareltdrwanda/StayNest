export interface SearchFilters {
  destination?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
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
}
