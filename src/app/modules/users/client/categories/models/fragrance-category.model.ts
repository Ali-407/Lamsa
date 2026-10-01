export interface CategoryBrowseFilter {
  categories?: string[];
  scentFamilies?: string[];
  occasions?: string[];
}

export interface FragranceCategory {
  id: string;
  title: string;
  notes: string;
  imageUrl?: string;
  placeholder?: boolean;
  filter: CategoryBrowseFilter;
}
