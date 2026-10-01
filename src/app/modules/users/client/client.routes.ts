import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
   {
    path: 'home',
    loadChildren: () =>
      import('./home/home.routes').then((m) => m.HOME_ROUTES)
  },
  
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },

  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.routes').then((m) => m.CART_ROUTES)
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('./categories/categories.routes').then((m) => m.CATEGORIES_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES)
  }
];
