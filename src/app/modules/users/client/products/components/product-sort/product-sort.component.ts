import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SortOption, SortType } from '../../models/product.model';

@Component({
  selector: 'app-product-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.scss'
})
export class ProductSortComponent {
  readonly productService = inject(ProductService);

  readonly sortOptions: SortOption[] = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Alphabetical: A-Z' },
    { value: 'newest', label: 'Newest Arrivals' }
  ];

  isDropdownOpen = false;

  get currentSortLabel(): string {
    const active = this.productService.sortOption();
    const match = this.sortOptions.find((opt) => opt.value === active);
    return match ? match.label : 'Recommended';
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectSort(value: SortType): void {
    this.productService.setSort(value);
    this.isDropdownOpen = false;
  }
}
