import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page.component').then(
        (m) => m.ProductListPageComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-detail-page/product-detail-page.component').then(
        (m) => m.ProductDetailPageComponent
      )
  }
];
