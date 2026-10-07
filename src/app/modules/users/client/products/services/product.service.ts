import { Injectable, computed, inject, signal } from '@angular/core';
import { defineQuery } from 'groq';
import { SanityService } from '../../../../../core/services/sanity.service';
import { Product, SortType, VolumeOption } from '../models/product.model';

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"]{
    _id,
    name,
    "slug": slug.current,
    price,
    originalPrice,
    "category": category->title,
    scentFamily,
    occasion,
    volume,
    volumes,
    concentration,
    inStock,
    featured,
    tags,
    notes,
    scentNotes,
    description,
    longDescription,
    images,
    "imageUrls": images[].asset->url
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && featured == true]{
    _id,
    name,
    "slug": slug.current,
    price,
    originalPrice,
    "category": category->title,
    scentFamily,
    occasion,
    volume,
    volumes,
    concentration,
    inStock,
    featured,
    tags,
    notes,
    scentNotes,
    description,
    longDescription,
    images,
    "imageUrls": images[].asset->url
  }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && (slug.current == $slug || _id == $slug)][0]{
    _id,
    name,
    "slug": slug.current,
    price,
    originalPrice,
    "category": category->title,
    scentFamily,
    occasion,
    volume,
    volumes,
    concentration,
    inStock,
    featured,
    tags,
    notes,
    scentNotes,
    description,
    longDescription,
    images,
    "imageUrls": images[].asset->url
  }
`);

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private sanity = inject(SanityService);

  readonly allProducts = signal<Product[]>([]);
  readonly categoriesList = signal<SanityCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly selectedCategories = signal<string[]>([]);
  readonly selectedScentFamilies = signal<string[]>([]);
  readonly selectedOccasions = signal<string[]>([]);
  readonly minPrice = signal<number>(50);
  readonly maxPrice = signal<number>(450);
  readonly sortOption = signal<SortType>('recommended');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(6);

  constructor() {
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const [rawProducts, rawCategories] = await Promise.all([
        this.sanity.fetch(PRODUCTS_QUERY),
        this.sanity.fetch(CATEGORIES_QUERY)
      ]);

      const categories = ((rawCategories as any[]) || []).map((cat: any) => ({
        _id: cat._id,
        title: cat.title,
        slug: cat.slug || '',
        description: this.descriptionText(cat.description)
      }));
      this.categoriesList.set(categories);

      const mappedProducts = ((rawProducts as any[]) || []).map((p: any) => this.mapSanityToProduct(p));
      this.allProducts.set(mappedProducts);
    } catch (err: any) {
      console.error('Failed to fetch data from Sanity:', err);
      this.error.set('Failed to load products from Sanity. Please check your connection.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      const raw = await this.sanity.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
      return raw ? this.mapSanityToProduct(raw) : undefined;
    } catch (err) {
      console.error(`Failed to fetch product by slug "${slug}" from Sanity:`, err);
      return undefined;
    }
  }

  async fetchFeaturedProducts(): Promise<Product[]> {
    try {
      const raw = await this.sanity.fetch(FEATURED_PRODUCTS_QUERY);
      const featured = ((raw as any[]) || []).map((p: any) => this.mapSanityToProduct(p));
      return featured.length ? featured : this.allProducts().filter((p) => p.badge === 'FEATURED').slice(0, 4);
    } catch (err) {
      console.error('Failed to fetch featured products from Sanity:', err);
      return this.allProducts().filter((p) => p.badge === 'FEATURED').slice(0, 4);
    }
  }

  getProductById(id: string): Product | undefined {
    return this.allProducts().find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || this.slugify(p.name) === id.toLowerCase()
    );
  }

  getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const current = this.getProductById(productId);
    if (!current) return this.allProducts().slice(0, limit);

    const matches = this.allProducts().filter(
      (p) => p.id !== current.id && (p.scentFamily === current.scentFamily || p.category === current.category)
    );

    if (matches.length >= limit) {
      return matches.slice(0, limit);
    }

    const remaining = this.allProducts().filter((p) => p.id !== current.id && !matches.includes(p));
    return [...matches, ...remaining].slice(0, limit);
  }

  readonly categoryOptions = computed(() => {
    const options = [{ id: 'all', label: 'All Fragrances' }];
    for (const cat of this.categoriesList()) {
      options.push({ id: cat.title, label: cat.title });
    }
    return options;
  });

  readonly scentFamilyOptions = [
    { id: 'Rose', label: 'Rose' },
    { id: 'Woody', label: 'Woody' },
    { id: 'Oriental', label: 'Oriental' },
    { id: 'Fresh', label: 'Fresh' },
    { id: 'Floral', label: 'Floral' },
    { id: 'Citrus', label: 'Citrus' }
  ];

  readonly occasionOptions = [
    { id: 'Red Carpet Gala', label: 'Red Carpet Gala' },
    { id: 'Day Wear', label: 'Day Wear' },
    { id: 'Gift Idea', label: 'Gift Idea' },
    { id: 'Evening', label: 'Evening' }
  ];

  readonly filteredProducts = computed(() => {
    let list = this.allProducts();
    const categories = this.selectedCategories();
    const families = this.selectedScentFamilies();
    const occasions = this.selectedOccasions();
    const minP = this.minPrice();
    const maxP = this.maxPrice();
    const sort = this.sortOption();

    if (categories.length > 0 && !categories.includes('all')) {
      list = list.filter((p) => categories.includes(p.category));
    }

    if (families.length > 0) {
      list = list.filter((p) => families.some((f) => p.scentFamily.toLowerCase().includes(f.toLowerCase())));
    }

    if (occasions.length > 0) {
      list = list.filter((p) => p.occasion && occasions.includes(p.occasion));
    }

    list = list.filter((p) => p.price >= minP && p.price <= maxP);

    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        sorted.reverse();
        break;
      case 'recommended':
      default:
        break;
    }

    return sorted;
  });

  readonly totalItemsCount = computed(() => this.filteredProducts().length);
  readonly totalCatalogCount = computed(() => this.allProducts().length);

  readonly totalPages = computed(() => {
    const total = this.totalItemsCount();
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  readonly paginatedProducts = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredProducts().slice(start, start + size);
  });

  toggleCategory(categoryId: string): void {
    const current = this.selectedCategories();
    if (categoryId === 'all') {
      this.selectedCategories.set(current.includes('all') ? [] : ['all']);
    } else {
      const withoutAll = current.filter((c) => c !== 'all');
      this.selectedCategories.set(
        withoutAll.includes(categoryId) ? withoutAll.filter((c) => c !== categoryId) : [...withoutAll, categoryId]
      );
    }
    this.currentPage.set(1);
  }

  toggleScentFamily(familyId: string): void {
    const current = this.selectedScentFamilies();
    this.selectedScentFamilies.set(
      current.includes(familyId) ? current.filter((f) => f !== familyId) : [...current, familyId]
    );
    this.currentPage.set(1);
  }

  toggleOccasion(occasionId: string): void {
    const current = this.selectedOccasions();
    this.selectedOccasions.set(
      current.includes(occasionId) ? current.filter((o) => o !== occasionId) : [...current, occasionId]
    );
    this.currentPage.set(1);
  }

  setPriceRange(min: number, max: number): void {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
  }

  setSort(sort: SortType): void {
    this.sortOption.set(sort);
  }

  setPage(page: number): void {
    const max = this.totalPages();
    if (page >= 1 && page <= max) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  applyCategoryBrowse(filter: {
    categories?: string[];
    scentFamilies?: string[];
    occasions?: string[];
  }): void {
    this.resetAllFilters();
    if (filter.categories?.length) {
      this.selectedCategories.set(filter.categories);
    }
    if (filter.scentFamilies?.length) {
      this.selectedScentFamilies.set(filter.scentFamilies);
    }
    if (filter.occasions?.length) {
      this.selectedOccasions.set(filter.occasions);
    }
    this.currentPage.set(1);
  }

  resetAllFilters(): void {
    this.selectedCategories.set([]);
    this.selectedScentFamilies.set([]);
    this.selectedOccasions.set([]);
    this.minPrice.set(50);
    this.maxPrice.set(450);
    this.sortOption.set('recommended');
    this.currentPage.set(1);
  }

  private mapSanityToProduct(sanityDoc: any): Product {
    const family = this.capitalize(sanityDoc.scentFamily || 'Woody');
    const categoryTitle = sanityDoc.category || 'Amber & Rich';
    const slug = sanityDoc.slug || sanityDoc._id || this.slugify(sanityDoc.name || 'perfume');
    const descriptionText = this.descriptionText(sanityDoc.description || sanityDoc.longDescription);
    const imagesList = this.extractSanityImageUrls(sanityDoc);
    const volume = sanityDoc.volume || '100 ml';

    return {
      id: slug,
      name: sanityDoc.name || 'Unnamed Perfume',
      subtitle: `${family.toUpperCase()} ACCORD`,
      price: Number(sanityDoc.price || 200),
      originalPrice: sanityDoc.originalPrice ? Number(sanityDoc.originalPrice) : undefined,
      category: categoryTitle,
      scentFamily: family,
      occasion: sanityDoc.occasion || 'Evening',
      volume,
      volumes: this.extractVolumes(sanityDoc.volumes),
      concentration: sanityDoc.concentration,
      availability: sanityDoc.inStock !== false ? 'IN STOCK' : 'LIMITED STOCK',
      badge: sanityDoc.featured ? 'FEATURED' : undefined,
      tags: Array.isArray(sanityDoc.tags) ? sanityDoc.tags.map((tag: any) => String(tag)).filter(Boolean) : undefined,
      notes: this.extractNotes(sanityDoc, family, categoryTitle),
      scentNotes: sanityDoc.scentNotes,
      placeholderVariant: this.determinePlaceholderVariant(family),
      description: descriptionText || 'An exquisite haute-parfumerie fragrance.',
      longDescription: descriptionText || 'An exquisite haute-parfumerie fragrance crafted with fine raw ingredients.',
      imageUrl: imagesList[0],
      images: imagesList
    };
  }

  private extractSanityImageUrls(sanityDoc: any): string[] {
    const urls: string[] = [];

    // 1. First preference: direct resolved asset URLs from GROQ query
    if (Array.isArray(sanityDoc?.imageUrls)) {
      for (const u of sanityDoc.imageUrls) {
        if (typeof u === 'string' && u.trim()) {
          urls.push(u.trim());
        }
      }
    }

    // 2. Second preference: Sanity image objects or strings using ImageUrlBuilder
    if (urls.length === 0 && Array.isArray(sanityDoc?.images)) {
      for (const img of sanityDoc.images) {
        if (typeof img === 'string' && img.trim()) {
          urls.push(img.trim());
        } else if (img) {
          try {
            const built = this.sanity.imageUrl(img, 1000);
            if (built) urls.push(built);
          } catch {
            // ignore fallback
          }
        }
      }
    }

    return urls;
  }

  private extractNotes(data: any, family: string, categoryTitle: string): string[] {
    const notes = data.notes;
    if (Array.isArray(notes)) {
      return notes.map((note: any) => String(note)).filter(Boolean);
    }
    if (typeof notes === 'string') {
      return notes.split(',').map((note) => note.trim()).filter(Boolean);
    }
    return [family, categoryTitle, 'Pure Essence'];
  }

  private extractVolumes(rawVolumes: any): VolumeOption[] | undefined {
    if (!Array.isArray(rawVolumes)) return undefined;

    const volumes = rawVolumes
      .map((vol: any) => ({
        size: vol.size || vol.volume || '100 ml',
        price: Number(vol.price || 0)
      }))
      .filter((vol) => vol.price > 0);

    return volumes.length ? volumes : undefined;
  }

  private descriptionText(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value
        .map((block: any) => {
          if (typeof block === 'string') return block;
          if (Array.isArray(block.children)) {
            return block.children.map((child: any) => child.text || '').join('');
          }
          return block.text || '';
        })
        .join(' ')
        .trim();
    }
    return '';
  }

  private slugify(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, '-');
  }

  private capitalize(value: string): string {
    const text = String(value || '').trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Woody';
  }

  private determinePlaceholderVariant(scentFamily: string): 'amber' | 'crystal' | 'emerald' | 'noir' | 'rose' | 'wood' {
    const f = scentFamily.toLowerCase();
    if (f.includes('wood') || f.includes('oud')) return 'wood';
    if (f.includes('rose') || f.includes('floral')) return 'rose';
    if (f.includes('fresh') || f.includes('citrus')) return 'emerald';
    if (f.includes('oriental') || f.includes('noir')) return 'noir';
    return 'amber';
  }
}
