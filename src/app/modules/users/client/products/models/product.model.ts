export interface VolumeOption {
  size: string;
  price: number;
}

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  imageUrl?: string;
  images?: string[];
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  category: string;
  scentFamily: string;
  occasion: string;
  volume: string;
  volumes?: VolumeOption[];
  concentration?: string;
  availability: 'IN STOCK' | 'LIMITED STOCK' | 'PRE-ORDER';
  badge?: string;
  tags?: string[];
  notes: string[];
  scentNotes?: ScentNotes;
  placeholderVariant: 'amber' | 'crystal' | 'emerald' | 'noir' | 'rose' | 'wood';
  description?: string;
  longDescription?: string;
}

export interface FilterState {
  categories: string[];
  scentFamilies: string[];
  occasions: string[];
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range';
  options: FilterOption[];
}

export type SortType = 'recommended' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export interface SortOption {
  value: SortType;
  label: string;
}
