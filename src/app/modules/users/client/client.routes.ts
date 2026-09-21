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

];
