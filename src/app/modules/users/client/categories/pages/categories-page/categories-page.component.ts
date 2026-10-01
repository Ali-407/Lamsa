import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbItem
} from '../../../products/components/breadcrumb/breadcrumb.component';
import { ProductService } from '../../../products/services/product.service';
import { FragranceCategory } from '../../models/fragrance-category.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Categories', active: true }
  ];

  readonly categories = signal<FragranceCategory[]>([
    {
      id: 'floral',
      title: 'Floral',
      notes: 'Rose, jasmine & neroli',
      imageUrl: '/categories/floral.jpg',
      filter: { categories: ['Floral & Delicate'] }
    },
    {
      id: 'woody',
      title: 'Woody',
      notes: 'Cedarwood, oud & santal',
      imageUrl: '/categories/woody.jpg',
      filter: { scentFamilies: ['Woody'] }
    },
    {
      id: 'oriental',
      title: 'Oriental',
      notes: 'Amber, spices & vanilla',
      imageUrl: '/categories/oriental.jpg',
      filter: { scentFamilies: ['Oriental'] }
    },
    {
      id: 'fresh',
      title: 'Fresh',
      notes: 'Citrus, marine & herbs',
      imageUrl: '/categories/fresh.jpg',
      filter: { scentFamilies: ['Fresh'] }
    },
    {
      id: 'private-reserve',
      title: 'Private Reserve',
      notes: 'Rare materials, singular batches',
      imageUrl: '/categories/private-reserve.jpg',
      filter: { categories: ['Amber & Rich'] }
    },
    {
      id: 'atelier-oils',
      title: 'Atelier Oils',
      notes: 'Concentrated botanical rituals',
      placeholder: true,
      filter: {}
    },
    {
      id: 'discovery-sets',
      title: 'Discovery Sets',
      notes: 'A passage through the house',
      imageUrl: '/categories/discovery-sets.jpg',
      filter: { occasions: ['Gift Idea'] }
    },
    {
      id: 'gifts-occasions',
      title: 'Gifts & Occasions',
      notes: 'Considered gestures, beautifully wrapped',
      imageUrl: '/categories/gifts-occasions.jpg',
      filter: { occasions: ['Gift Idea'] }
    }
  ]);

  exploreCategory(category: FragranceCategory): void {
    this.productService.applyCategoryBrowse(category.filter);
    this.router.navigate(['/products']);
  }
}
