import { Routes } from '@angular/router';
import { authenticatedUserGuard } from '@core/guards/authenticated-user-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@public/layout/public-layout/public-layout'),
    loadChildren: () => import('@public/public.routes')
  },
  {
    path: 'admin',
    loadComponent: () => import('@admin/layout/admin-layout/admin-layout'),
    loadChildren: () => import('@admin/admin.routes'),
    canActivate: [authenticatedUserGuard],
  },
  {
    path: 'cuenta',
    loadComponent: () => import('@account/layout/account-layout/account-layout'),
    loadChildren: () => import('@account/account.routes')
  },
  {
    path: '**',
    loadComponent: () => import('@shared/pages/not-found-page/not-found-page')
  }
];
