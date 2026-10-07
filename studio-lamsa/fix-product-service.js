const fs = require('fs');

const targetFile = 'C:\\Users\\Ali\\Desktop\\LamsaProject\\Lamsa-FrontEnd\\src\\app\\modules\\users\\client\\products\\services\\product.service.ts';

const content = `import { Injectable, signal, computed, inject } from '@angular/core';
import { defineQuery } from 'groq';
import { SanityService } from '../../../../../core/services/sanity.service';
import { Product, SortType } from '../models/product.model';

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export const PRODUCTS_QUERY = defineQuery(\`
  *[_type == "product"]{
    _id,
    name,
    "slug": slug.current,
    price,
    "category": category->title,
    scentFamily,
    volume,
    inStock,
    featured,
    description,
    images
  }
\`);

export const CATEGORIES_QUERY = defineQuery(\`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description
  }
\`);

export const FEATURED_PRODUCTS_QUERY = defineQuery(\`
  *[_type == "product" && featured == true]{
    _id,
    name,
    "slug": slug.current,
    price,
    "category": category->title,
    scentFamily,
    volume,
    inStock,
    featured,
    description,
    images
  }
\`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(\`
  *[_type == "product" && (slug.current == $slug || _id == $slug)][0]{
    _id,
    name,
    "slug": slug.current,
    price,
    "category": category->title,
    scentFamily,
    volume,
    inStock,
    featured,
    description,
    images
  }
\`);

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private sanity = inject(SanityService);

  // State Signals
  readonly allProducts = signal<Product[]>([]);
  readonly categoriesList = signal<SanityCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Active Filters
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

  /**
   * Fetch all products & categories directly from Sanity Content Lake
   */
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
        description: cat.description
      }));
      this.categoriesList.set(categories);

      const mappedProducts: Product[] = ((rawProducts as any[]) || []).map((p: any) => this.mapSanityToProduct(p));
      this.allProducts.set(mappedProducts);
    } catch (err: any) {
      console.error('Failed to fetch data from Sanity:', err);
      this.error.set('Failed to load products from Sanity. Please check your connection.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Fetch a single product by slug or ID directly from Sanity
   */
  async fetchProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      const raw = await this.sanity.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
      if (!raw) return undefined;
      return this.mapSanityToProduct(raw);
    } catch (err) {
      console.error(\`Failed to fetch product by slug "\${slug}":\`, err);
      return undefined;
    }
  }

  /**
   * Fetch featured products directly from Sanity
   */
  async fetchFeaturedProducts(): Promise<Product[]> {
    try {
      const raw = await this.sanity.fetch(FEATURED_PRODUCTS_QUERY);
      return ((raw as any[]) || []).map((p: any) => this.mapSanityToProduct(p));
    } catch (err) {
      console.error('Failed to fetch featured products from Sanity:', err);
      return [];
    }
  }

  /** Helper getters */
  getProductById(id: string): Product | undefined {
    return this.allProducts().find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || p.name.toLowerCase().replace(/\\s+/g, '-') === id.toLowerCase()
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

  // Computed Options for UI Filters
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

  // Computed: Filtered and Sorted Products
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

  // Computed Pagination & Counts
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

  // Actions
  toggleCategory(categoryId: string): void {
    const current = this.selectedCategories();
    if (categoryId === 'all') {
      if (current.includes('all')) {
        this.selectedCategories.set([]);
      } else {
        this.selectedCategories.set(['all']);
      }
    } else {
      const withoutAll = current.filter((c) => c !== 'all');
      if (withoutAll.includes(categoryId)) {
        this.selectedCategories.set(withoutAll.filter((c) => c !== categoryId));
      } else {
        this.selectedCategories.set([...withoutAll, categoryId]);
      }
    }
    this.currentPage.set(1);
  }

  toggleScentFamily(familyId: string): void {
    const current = this.selectedScentFamilies();
    if (current.includes(familyId)) {
      this.selectedScentFamilies.set(current.filter((f) => f !== familyId));
    } else {
      this.selectedScentFamilies.set([...current, familyId]);
    }
    this.currentPage.set(1);
  }

  toggleOccasion(occasionId: string): void {
    const current = this.selectedOccasions();
    if (current.includes(occasionId)) {
      this.selectedOccasions.set(current.filter((o) => o !== occasionId));
    } else {
      this.selectedOccasions.set([...current, occasionId]);
    }
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

  /**
   * Helper to map Sanity document -> Angular Product model
   */
  private mapSanityToProduct(sanityDoc: any): Product {
    const family = (sanityDoc.scentFamily || 'Woody').charAt(0).toUpperCase() + (sanityDoc.scentFamily || 'Woody').slice(1);
    const categoryTitle = sanityDoc.category || 'Amber & Rich';
    const slug = sanityDoc.slug || sanityDoc._id;

    let descriptionText = '';
    if (Array.isArray(sanityDoc.description)) {
      descriptionText = sanityDoc.description
        .map((block: any) => block.children?.map((c: any) => c.text).join('') || '')
        .join(' ');
    } else if (typeof sanityDoc.description === 'string') {
      descriptionText = sanityDoc.description;
    }

    let imageUrl = '';
    if (sanityDoc.images && sanityDoc.images.length > 0) {
      imageUrl = this.sanity.imageUrl(sanityDoc.images[0], 600);
    }

    const placeholderVariant = this.determinePlaceholderVariant(family);

    return {
      id: slug,
      name: sanityDoc.name || 'Unnamed Perfume',
      subtitle: \`\${family.toUpperCase()} ACCORD\`,
      price: sanityDoc.price || 200,
      category: categoryTitle,
      scentFamily: family,
      occasion: 'Evening',
      volume: sanityDoc.volume || '100 ml',
      availability: sanityDoc.inStock !== false ? 'IN STOCK' : 'LIMITED STOCK',
      badge: sanityDoc.featured ? 'FEATURED' : undefined,
      notes: [family, categoryTitle, 'Pure Essence'],
      placeholderVariant: placeholderVariant,
      description: descriptionText || 'An exquisite haute-parfumerie fragrance.',
      longDescription: descriptionText || 'An exquisite haute-parfumerie fragrance crafted with fine raw ingredients.'
    };
  }

  private determinePlaceholderVariant(scentFamily: string): 'amber' | 'crystal' | 'emerald' | 'noir' | 'rose' | 'wood' {
    const f = scentFamily.toLowerCase();
    if (f.includes('wood')) return 'wood';
    if (f.includes('rose') || f.includes('floral')) return 'rose';
    if (f.includes('fresh') || f.includes('citrus')) return 'emerald';
    if (f.includes('oriental')) return 'noir';
    return 'amber';
  }
}
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated product.service.ts!');
