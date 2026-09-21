import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-pagination.component.html',
  styleUrl: './product-pagination.component.scss'
})
export class ProductPaginationComponent {
  readonly productService = inject(ProductService);

  onPrev(): void {
    this.productService.prevPage();
  }

  onNext(): void {
    this.productService.nextPage();
  }

  onSelectPage(page: number): void {
    this.productService.setPage(page);
  }
}
