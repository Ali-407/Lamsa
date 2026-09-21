import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component';
import { PerfumeFilterComponent } from '../../components/perfume-filter/perfume-filter.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductSortComponent } from '../../components/product-sort/product-sort.component';
import { ProductPaginationComponent } from '../../components/product-pagination/product-pagination.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PerfumeFilterComponent,
    ProductCardComponent,
    ProductSortComponent,
    ProductPaginationComponent
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss'
})
export class ProductListPageComponent {
  readonly productService = inject(ProductService);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Shop', url: '/products' },
    { label: 'All Fragrances', active: true }
  ];

  onProductAddToCart(product: Product): void {
    console.log(`Product added to cart: ${product.name} (${product.id})`);
  }
}
