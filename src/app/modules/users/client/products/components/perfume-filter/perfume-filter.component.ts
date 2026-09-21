import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-perfume-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfume-filter.component.html',
  styleUrl: './perfume-filter.component.scss'
})
export class PerfumeFilterComponent {
  readonly productService = inject(ProductService);

  readonly categoryOptions = this.productService.categoryOptions;
  readonly scentFamilyOptions = this.productService.scentFamilyOptions;
  readonly occasionOptions = this.productService.occasionOptions;

  // Local binding for price range slider
  currentMinPrice = 50;
  currentMaxPrice = 450;

  isCategorySelected(categoryId: string): boolean {
    const selected = this.productService.selectedCategories();
    if (categoryId === 'all') {
      return selected.includes('all') || selected.length === 0;
    }
    return selected.includes(categoryId);
  }

  isScentFamilySelected(familyId: string): boolean {
    return this.productService.selectedScentFamilies().includes(familyId);
  }

  isOccasionSelected(occasionId: string): boolean {
    return this.productService.selectedOccasions().includes(occasionId);
  }

  onToggleCategory(categoryId: string): void {
    this.productService.toggleCategory(categoryId);
  }

  onToggleScentFamily(familyId: string): void {
    this.productService.toggleScentFamily(familyId);
  }

  onToggleOccasion(occasionId: string): void {
    this.productService.toggleOccasion(occasionId);
  }

  onMinPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (val <= this.currentMaxPrice) {
      this.currentMinPrice = val;
      this.productService.setPriceRange(this.currentMinPrice, this.currentMaxPrice);
    }
  }

  onMaxPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (val >= this.currentMinPrice) {
      this.currentMaxPrice = val;
      this.productService.setPriceRange(this.currentMinPrice, this.currentMaxPrice);
    }
  }

  resetFilters(): void {
    this.currentMinPrice = 50;
    this.currentMaxPrice = 450;
    this.productService.resetAllFilters();
  }
}
