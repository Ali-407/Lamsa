import { Injectable, signal, computed } from '@angular/core';
import { Product, FilterState, SortType } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Comprehensive mock data replicating the luxury catalog & reference image
  private readonly productsData: Product[] = [
    {
      id: 'santal-parchment',
      name: 'Santal Parchment',
      subtitle: 'WOODY, PAPYRUS & WARM SPICE',
      price: 220,
      category: 'Amber & Rich',
      scentFamily: 'Woody',
      occasion: 'Evening',
      volume: '100 ml',
      concentration: 'PARFUM',
      availability: 'IN STOCK',
      badge: 'SIGNATURE',
      tags: ['NIGHTTIME ELEGANCE', 'EXCLUSIVE BOTTLING'],
      volumes: [
        { size: '50 ml', price: 160 },
        { size: '75 ml', price: 195 },
        { size: '100 ml', price: 220 }
      ],
      notes: ['Sicilian Bergamot', 'Pink Pepper', 'Egyptian Jasmine', 'Papyrus', 'Wild Mysore Sandalwood', 'Cinnamon', 'Patchouli'],
      scentNotes: {
        top: ['Sicilian Bergamot', 'Pink Pepper'],
        heart: ['Egyptian Jasmine', 'Papyrus'],
        base: ['Wild Mysore Sandalwood', 'Cinnamon', 'Patchouli']
      },
      placeholderVariant: 'amber',
      description: 'Santal Parchment wraps around the skin like vintage vellum paper. It opens with bright top notes, shifting to clean papyrus and warm rich sandalwood that rests on earthy cardamom and musk.',
      longDescription: 'Crafted as an ode to ancient botanical manuscripts, Santal Parchment delivers an intimate, velvet aura. Hand-selected Sicilian bergamot and vibrant pink peppercorn open the olfactory experience, smoothly yielding to a heart of rare Egyptian jasmine sambac and dry papyrus. The drydown reveals imperial Mysore sandalwood harvested under full moon cycles, supported by wild cinnamon bark and dark Indonesian patchouli.'
    },
    {
      id: 'prod-001',
      name: 'Fleur de Cire',
      subtitle: 'FLORAL, CITRUS NOTES',
      price: 195,
      category: 'Floral & Delicate',
      scentFamily: 'Rose',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['FLORAL LUMINOSITY', 'HANDCRAFTED'],
      volumes: [
        { size: '50 ml', price: 145 },
        { size: '75 ml', price: 170 },
        { size: '100 ml', price: 195 }
      ],
      notes: ['Orange Blossom', 'Beeswax', 'White Amber'],
      scentNotes: {
        top: ['Mandarin Zest', 'Neroli Petals'],
        heart: ['Grasse Orange Blossom', 'Warm Honeycomb Beeswax'],
        base: ['White Amber Accord', 'Golden Benzoin']
      },
      placeholderVariant: 'amber',
      description: 'A glowing solar floral infused with warm honeyed beeswax and fresh orange blossoms.',
      longDescription: 'Fleur de Cire evokes sun-drenched orange groves at noon, captured in molten golden wax. A bright citrus sparkle settles into rich honeyed florals, creating an alluring solar trail on warm skin.'
    },
    {
      id: 'prod-002',
      name: 'Grand Parfumeur',
      subtitle: 'WOODY, SPICE & AMBER ACCORD',
      price: 230,
      category: 'Amber & Rich',
      scentFamily: 'Woody',
      occasion: 'Evening',
      volume: '100 ml',
      concentration: 'EXTRAIT DE PARFUM',
      availability: 'IN STOCK',
      badge: 'BESTSELLER',
      tags: ['HERITAGE SELECTION', 'MASTER CREATION'],
      volumes: [
        { size: '50 ml', price: 170 },
        { size: '75 ml', price: 205 },
        { size: '100 ml', price: 230 }
      ],
      notes: ['Cedarwood', 'Cardamom', 'Smoked Incense'],
      scentNotes: {
        top: ['Green Cardamom', 'Guatemalan Nutmeg'],
        heart: ['Atlas Cedarwood', 'Smoked Frankincense'],
        base: ['Cashmere Amber', 'Tonka Bean']
      },
      placeholderVariant: 'crystal',
      description: 'A majestic tribute to the grand traditions of master perfumers with precious woods.',
      longDescription: 'Grand Parfumeur embodies haute parfumerie artistry. Complex spice facets intertwine with aged cedarwood reserves and sacred incense resin for an enduring statement of refined luxury.'
    },
    {
      id: 'prod-003',
      name: 'Noir Couronne',
      subtitle: 'LEATHER, SMOKY VETIVER',
      price: 210,
      category: 'Amber & Rich',
      scentFamily: 'Woody',
      occasion: 'Red Carpet Gala',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['NOCTURNAL INTENSITY', 'ROYAL ACCORD'],
      volumes: [
        { size: '50 ml', price: 155 },
        { size: '75 ml', price: 185 },
        { size: '100 ml', price: 210 }
      ],
      notes: ['Black Pepper', 'Smoked Birch', 'Tuscan Leather'],
      scentNotes: {
        top: ['Crushed Black Pepper', 'Smoky Birch Tar'],
        heart: ['Tuscan Leather Accord', 'Violet Leaf'],
        base: ['Vetiver Bourbon', 'Obsidian Resin']
      },
      placeholderVariant: 'noir',
      description: 'An enigmatic nocturnal signature built around velvety dark leather and obsidian resin.',
      longDescription: 'Dark, sovereign, and compelling. Noir Couronne envelops the wearer in rich glove leather, black pepper sparks, and slow-burnt birch smoke.'
    },
    {
      id: 'prod-004',
      name: "Soleil d'Or",
      subtitle: 'CITRUS, BERGAMOT & MUSK',
      price: 185,
      category: 'Citrus & Fresh',
      scentFamily: 'Fresh',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['MEDITERRANEAN SUNLIGHT', 'VIBRANT'],
      volumes: [
        { size: '50 ml', price: 135 },
        { size: '75 ml', price: 160 },
        { size: '100 ml', price: 185 }
      ],
      notes: ['Calabrian Bergamot', 'Neroli', 'Sunlit Amber'],
      scentNotes: {
        top: ['Calabrian Bergamot', 'Bitter Orange'],
        heart: ['Tunisian Neroli', 'Petitgrain'],
        base: ['Sunlit Musk', 'Golden Amber']
      },
      placeholderVariant: 'emerald',
      description: 'Sunlight captured in glass, radiant Mediterranean citrus softened with pure amber.',
      longDescription: 'Soleil d\'Or captures the golden light of the Amalfi coast. Zesty bergamot meets luminous orange blossom before settling into silky sun-warmed amber.'
    },
    {
      id: 'prod-005',
      name: 'Ambre Oud',
      subtitle: 'AGARWOOD, WARM AMBER',
      price: 275,
      category: 'Amber & Rich',
      scentFamily: 'Oriental',
      occasion: 'Evening',
      volume: '100 ml',
      concentration: 'EXTRAIT DE PARFUM',
      availability: 'LIMITED STOCK',
      badge: 'EXCLUSIVE',
      tags: ['RARE RESERVE', 'ORIENTAL OPULENCE'],
      volumes: [
        { size: '50 ml', price: 200 },
        { size: '75 ml', price: 240 },
        { size: '100 ml', price: 275 }
      ],
      notes: ['Rare Oud Wood', 'Bourbon Vanilla', 'Golden Amber'],
      scentNotes: {
        top: ['Saffron Threads', 'Cardamom Pods'],
        heart: ['Cambodian Oud Wood', 'Smoked Birch'],
        base: ['Madagascar Bourbon Vanilla', 'Amber Resin']
      },
      placeholderVariant: 'wood',
      description: 'A deep, hypnotic oriental voyage combining aged Cambodian oud and velvety vanilla.',
      longDescription: 'Ambre Oud is an extraordinary creation built around rare Cambodian oud wood aged for decades, mellowed by rich Madagascar vanilla and glowing amber resins.'
    },
    {
      id: 'prod-006',
      name: 'Rose Absolute',
      subtitle: 'DAMASCUS ROSE, VIOLET LEAF',
      price: 205,
      category: 'Floral & Delicate',
      scentFamily: 'Rose',
      occasion: 'Gift Idea',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['GRASSE BLOOMS', 'PURE BOTANICAL'],
      volumes: [
        { size: '50 ml', price: 150 },
        { size: '75 ml', price: 180 },
        { size: '100 ml', price: 205 }
      ],
      notes: ['Grasse Centifolia', 'Damascus Petals', 'Powdery Musk'],
      scentNotes: {
        top: ['Pink Pepper', 'Violet Leaf'],
        heart: ['Grasse Centifolia Rose', 'Damascus Rose Absolute'],
        base: ['Powdery White Musk', 'Sandalwood']
      },
      placeholderVariant: 'rose',
      description: 'The definitive royal rose, celebrating thousand-petaled Grasse blooms at dawn.',
      longDescription: 'Hand-picked at dawn in Grasse, thousands of rose petals yield their purest heart essence in this romantic, ethereal floral composition.'
    },
    {
      id: 'prod-007',
      name: 'Vetiver Imperial',
      subtitle: 'EARTHY VETIVER & CEDAR',
      price: 190,
      category: 'Citrus & Fresh',
      scentFamily: 'Woody',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['TERRAIN ELEGANCE', 'EARTH & SPICE'],
      volumes: [
        { size: '50 ml', price: 140 },
        { size: '75 ml', price: 165 },
        { size: '100 ml', price: 190 }
      ],
      notes: ['Haitian Vetiver', 'Pink Peppercorn', 'Atlas Cedar'],
      scentNotes: {
        top: ['Grapefruit Zest', 'Pink Peppercorn'],
        heart: ['Haitian Vetiver Roots', 'Geranium'],
        base: ['Atlas Cedarwood', 'Oakmoss']
      },
      placeholderVariant: 'emerald',
      description: 'Crisp green earthy elegance rooted in volcanic Haitian vetiver roots.',
      longDescription: 'Clean, green, and commanding. Vetiver Imperial brings crisp citrus brightness to rich vetiver roots grown in mineral-rich volcanic soil.'
    },
    {
      id: 'prod-008',
      name: 'Cuir Majestueux',
      subtitle: 'SAFFRON, LEATHER & SUEDE',
      price: 260,
      category: 'Amber & Rich',
      scentFamily: 'Oriental',
      occasion: 'Red Carpet Gala',
      volume: '100 ml',
      concentration: 'EXTRAIT DE PARFUM',
      availability: 'IN STOCK',
      tags: ['MAJESTIC LEATHER', 'PERSIAN SPICE'],
      volumes: [
        { size: '50 ml', price: 190 },
        { size: '75 ml', price: 225 },
        { size: '100 ml', price: 260 }
      ],
      notes: ['Persian Saffron', 'Soft Suede', 'Frankincense'],
      scentNotes: {
        top: ['Persian Saffron', 'Thyme'],
        heart: ['Soft White Suede', 'Olibanum Resin'],
        base: ['Golden Amber', 'Wild Leather']
      },
      placeholderVariant: 'noir',
      description: 'Opulent saffron interwoven with supple suede and balsamic frankincense.',
      longDescription: 'A fragrance of pure sophistication. Precious Persian saffron threads illuminate smooth white suede and mystical frankincense smoke.'
    },
    {
      id: 'prod-009',
      name: 'Fleur Blanche',
      subtitle: 'JASMINE SAMBAC & TUBEROSE',
      price: 195,
      category: 'Floral & Delicate',
      scentFamily: 'Rose',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['WHITE FLORAL', 'MOONLIT HARVEST'],
      volumes: [
        { size: '50 ml', price: 145 },
        { size: '75 ml', price: 170 },
        { size: '100 ml', price: 195 }
      ],
      notes: ['Night Jasmine', 'Indian Tuberose', 'Cashmeran'],
      scentNotes: {
        top: ['Green Leaves', 'Bergamot'],
        heart: ['Night Jasmine Sambac', 'Indian Tuberose'],
        base: ['Cashmeran Wood', 'Creamy Musk']
      },
      placeholderVariant: 'rose',
      description: 'Luminous white petals unfolding under a moonlit Mediterranean summer night.',
      longDescription: 'Fleur Blanche captures the hypnotic allure of night-blooming white flowers. Rich tuberose and dew-drenched jasmine sambac rest on velvety cashmeran.'
    },
    {
      id: 'prod-010',
      name: 'Santal Mystique',
      subtitle: 'MYSORE SANDALWOOD & SPICES',
      price: 245,
      category: 'Amber & Rich',
      scentFamily: 'Woody',
      occasion: 'Evening',
      volume: '100 ml',
      concentration: 'EXTRAIT DE PARFUM',
      availability: 'LIMITED STOCK',
      tags: ['SACRED WOODS', 'CREAMY AMBER'],
      volumes: [
        { size: '50 ml', price: 180 },
        { size: '75 ml', price: 215 },
        { size: '100 ml', price: 245 }
      ],
      notes: ['Mysore Sandalwood', 'Cardamom', 'Tonka Bean'],
      scentNotes: {
        top: ['Green Cardamom', 'Violet'],
        heart: ['Pure Mysore Sandalwood', 'Iris Root'],
        base: ['Brazilian Tonka Bean', 'Cedar']
      },
      placeholderVariant: 'wood',
      description: 'Creamy sandalwood enriched with precious spices and golden warmth.',
      longDescription: 'Santal Mystique offers a meditative, velvety sandalwood experience enriched by crushed cardamom and sweet tonka bean base notes.'
    },
    {
      id: 'prod-011',
      name: 'Aqua Celesta',
      subtitle: 'MARINE ACCORD & MANDARIN',
      price: 165,
      category: 'Citrus & Fresh',
      scentFamily: 'Fresh',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['OCEANIC BRIGHTNESS', 'FRESH ESSENCE'],
      volumes: [
        { size: '50 ml', price: 120 },
        { size: '75 ml', price: 145 },
        { size: '100 ml', price: 165 }
      ],
      notes: ['Sea Salt', 'Italian Mandarin', 'Driftwood'],
      scentNotes: {
        top: ['Italian Mandarin', 'Sea Salt Spray'],
        heart: ['Crisp Mint Leaf', 'Blackcurrant'],
        base: ['Sun-Dried Driftwood', 'Clean Musk']
      },
      placeholderVariant: 'crystal',
      description: 'An invigorating sea breeze infused with sparkling Italian citrus groves.',
      longDescription: 'Pure refreshing clarity. Aqua Celesta blends sea salt spray with sunlit Italian mandarin and weather-worn ocean driftwood.'
    },
    {
      id: 'prod-012',
      name: 'Vanille Royale',
      subtitle: 'MADAGASCAR VANILLA & COGNAC',
      price: 220,
      category: 'Amber & Rich',
      scentFamily: 'Oriental',
      occasion: 'Gift Idea',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['GOURMAND LUXURY', 'OAK BARREL'],
      volumes: [
        { size: '50 ml', price: 160 },
        { size: '75 ml', price: 190 },
        { size: '100 ml', price: 220 }
      ],
      notes: ['Aged Vanilla Bean', 'Golden Cognac', 'Smoked Oak'],
      scentNotes: {
        top: ['Golden Cognac', 'Dried Plum'],
        heart: ['Aged Madagascar Vanilla', 'Cacao Pod'],
        base: ['Smoked Oak Wood', 'Praline Amber']
      },
      placeholderVariant: 'amber',
      description: 'Decadent bourbon vanilla balanced by oak barrels and refined cognac accents.',
      longDescription: 'A rich gourmand masterpiece. Madagascar vanilla pods are steeped in aged cognac casks, yielding a cozy yet opulent olfactory portrait.'
    },
    {
      id: 'prod-013',
      name: 'Fleur de Luxe',
      subtitle: 'FLORAL, JASMINE & WHITE MUSK',
      price: 195,
      category: 'Floral & Delicate',
      scentFamily: 'Rose',
      occasion: 'Day Wear',
      volume: '100 ml',
      concentration: 'EAU DE PARFUM',
      availability: 'IN STOCK',
      tags: ['FLORAL ELEGANCE', 'DAYTIME LUMINOSITY'],
      volumes: [
        { size: '50 ml', price: 145 },
        { size: '75 ml', price: 170 },
        { size: '100 ml', price: 195 }
      ],
      notes: ['Grandiflorum Jasmine', 'White Musk', 'Peony'],
      scentNotes: {
        top: ['Fresh Bergamot', 'Pink Peony'],
        heart: ['Grandiflorum Jasmine', 'Magnolia'],
        base: ['Velvet White Musk', 'Blonde Woods']
      },
      placeholderVariant: 'rose',
      description: 'A delicate bouquet of night-blooming white florals and fresh peony petals.',
      longDescription: 'Fleur de Luxe infuses crisp morning air with soft peony and rare jasmine blossoms for an effortless signature of timeless feminine elegance.'
    },
    {
      id: 'prod-014',
      name: 'Soir Cocon',
      subtitle: 'ORIENTAL, TOBACCO & VANILLA',
      price: 240,
      category: 'Amber & Rich',
      scentFamily: 'Oriental',
      occasion: 'Evening',
      volume: '100 ml',
      concentration: 'EXTRAIT DE PARFUM',
      availability: 'IN STOCK',
      tags: ['INTIMATE COMFORT', 'DARK TOBACCO'],
      volumes: [
        { size: '50 ml', price: 175 },
        { size: '75 ml', price: 210 },
        { size: '100 ml', price: 240 }
      ],
      notes: ['Blonde Tobacco', 'Vanilla Bean', 'Cocoa Butter'],
      scentNotes: {
        top: ['Spiced Clove', 'Dried Fruits'],
        heart: ['Blonde Tobacco Leaf', 'Tonka Bean'],
        base: ['Bourbon Vanilla', 'Rich Cacao']
      },
      placeholderVariant: 'noir',
      description: 'A comforting nocturnal embrace of sweet tobacco leaves and velvety vanilla.',
      longDescription: 'Warm, enveloped, and inviting. Soir Cocon wraps the wearer in golden honeyed tobacco, dark roasted cocoa, and soothing vanilla pods.'
    }
  ];

  // Helper getters
  getProductById(id: string): Product | undefined {
    return this.allProducts().find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
  }

  getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const current = this.getProductById(productId);
    if (!current) return this.allProducts().slice(0, limit);

    // Prefer products in same scent family or category
    const matches = this.allProducts().filter(
      (p) => p.id !== current.id && (p.scentFamily === current.scentFamily || p.category === current.category)
    );

    if (matches.length >= limit) {
      return matches.slice(0, limit);
    }

    const remaining = this.allProducts().filter((p) => p.id !== current.id && !matches.includes(p));
    return [...matches, ...remaining].slice(0, limit);
  }

  // State Signals
  readonly allProducts = signal<Product[]>(this.productsData);
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedScentFamilies = signal<string[]>(['Woody']); // Default matches reference
  readonly selectedOccasions = signal<string[]>([]);
  readonly minPrice = signal<number>(50);
  readonly maxPrice = signal<number>(450);
  readonly sortOption = signal<SortType>('recommended');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(6); // 6 products per page as shown in reference

  // Available Filter Options
  readonly categoryOptions = [
    { id: 'all', label: 'All Fragrances' },
    { id: 'Floral & Delicate', label: 'Floral & Delicate' },
    { id: 'Amber & Rich', label: 'Amber & Rich' },
    { id: 'Citrus & Fresh', label: 'Citrus & Fresh' }
  ];

  readonly scentFamilyOptions = [
    { id: 'Rose', label: 'Rose' },
    { id: 'Woody', label: 'Woody' },
    { id: 'Oriental', label: 'Oriental' },
    { id: 'Fresh', label: 'Fresh' }
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

    // Filter by Category (if selected and not 'all')
    if (categories.length > 0 && !categories.includes('all')) {
      list = list.filter((p) => categories.includes(p.category));
    }

    // Filter by Scent Family
    if (families.length > 0) {
      list = list.filter((p) => families.includes(p.scentFamily));
    }

    // Filter by Occasion
    if (occasions.length > 0) {
      list = list.filter((p) => occasions.includes(p.occasion));
    }

    // Filter by Price Range
    list = list.filter((p) => p.price >= minP && p.price <= maxP);

    // Sorting logic
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
        // Default curated catalog order
        break;
    }

    return sorted;
  });

  // Computed: Total counts and pagination
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
}
