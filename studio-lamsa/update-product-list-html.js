const fs = require('fs');

const targetFile = 'C:\\Users\\Ali\\Desktop\\LamsaProject\\Lamsa-FrontEnd\\src\\app\\modules\\users\\client\\products\\pages\\product-list-page\\product-list-page.component.html';

const content = `<div class="product-listing-page">
  <div class="container page-container">
    <!-- 1. Breadcrumb Section -->
    <app-breadcrumb [items]="breadcrumbs"></app-breadcrumb>

    <!-- 2. Page Title Header -->
    <header class="page-header">
      <h1 class="page-title">All Fragrances</h1>
      <p class="page-subtitle">
        Our luxury formulations curated to elevate every scent experience with unparalleled elegance.
      </p>
    </header>

    <!-- Loading & Error States -->
    @if (productService.isLoading()) {
      <div class="loading-container" style="text-align: center; padding: 60px 0; color: #999;">
        <p>Loading luxury catalog from Sanity...</p>
      </div>
    } @else if (productService.error()) {
      <div class="error-container" style="text-align: center; padding: 60px 0; color: #e53e3e;">
        <p>{{ productService.error() }}</p>
        <button type="button" class="btn-primary" (click)="productService.loadInitialData()" style="margin-top: 15px;">
          Retry
        </button>
      </div>
    } @else {
      <!-- Main Layout: Filters Sidebar + Products Content -->
      <div class="catalog-layout">
        <!-- 3. Filters Sidebar -->
        <aside class="sidebar-column">
          <app-perfume-filter></app-perfume-filter>
        </aside>

        <!-- Main Catalog Column -->
        <main class="catalog-main-column">
          <!-- 4. Sort Dropdown & Products Count Bar -->
          <app-product-sort></app-product-sort>

          <!-- 5. Product Grid -->
          @if (productService.paginatedProducts().length > 0) {
          <div class="product-grid" role="region" aria-label="Product catalog grid">
            @for (product of productService.paginatedProducts(); track product.id) {
            <div class="product-grid-item">
              <app-product-card [product]="product" (addToCart)="onProductAddToCart($event)">
              </app-product-card>
            </div>
            }
          </div>

          <!-- 6. Pagination -->
          <app-product-pagination></app-product-pagination>
          } @else {
          <!-- Empty State -->
          <div class="no-products-state">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="1.2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 15h8M9 9h.01M15 9h.01"></path>
              </svg>
            </div>
            <h2 class="empty-title">No Fragrances Found</h2>
            <p class="empty-desc">
              No creations match your current filter selections. Try adjusting your preferences or clearing filters.
            </p>
            <button type="button" class="btn-primary" (click)="productService.resetAllFilters()">
              Clear All Filters
            </button>
          </div>
          }
        </main>
      </div>
    }
  </div>
</div>
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated product-list-page.component.html!');
