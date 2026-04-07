import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@public/public.routes')
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.routes')
  },
  {
    path: 'cuenta',
    loadChildren: () => import('@account/account.routes')
  },
  {
    path: '**',
    loadComponent: () => import('@shared/components/not-found-page/not-found-page')
  }
];
