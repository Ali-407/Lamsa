const fs = require('fs');

const targetFile = 'C:\\Users\\Ali\\Desktop\\LamsaProject\\Lamsa-FrontEnd\\src\\app\\modules\\users\\client\\home\\components\\featured-perfumes\\featured-perfumes.component.html';

const content = `<section id="featured" class="featured-section" aria-labelledby="featured-heading">
  <div class="container">
    <!-- Section Header -->
    <div class="section-header">
      <span class="eyebrow">CURATED SELECTION</span>
      <h2 id="featured-heading" class="section-title heading-serif">Featured Fragrances</h2>
      <p class="section-desc">
        Explore our hallmark olfactive creations, handcrafted with rare botanical elixirs.
      </p>
    </div>

    <!-- Loading State -->
    @if (isLoading()) {
      <div class="loading-state" style="text-align: center; padding: 40px 0; color: #999;">
        <p>Loading curated fragrances from Sanity...</p>
      </div>
    } @else if (error()) {
      <div class="error-state" style="text-align: center; padding: 40px 0; color: #e53e3e;">
        <p>{{ error() }}</p>
      </div>
    } @else {
      <!-- Product Grid -->
      <div class="products-grid">
        @for (item of perfumes(); track item.id) {
          <app-perfume-card [perfume]="item"></app-perfume-card>
        } @empty {
          <p style="text-align: center; width: 100%; color: #999;">No featured perfumes available.</p>
        }
      </div>
    }
  </div>
</section>
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated featured-perfumes.component.html!');
