import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    loadChildren: () =>
      import('./modules/users/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
