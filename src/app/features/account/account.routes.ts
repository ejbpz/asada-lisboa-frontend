import { Routes } from "@angular/router";
import { nonAuthenticatedUserGuard } from "@core/guards/non-authenticated-user-guard";

const authRoutes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@account/pages/login-page/login-page'),
    canActivate: [nonAuthenticatedUserGuard]
  },
  {
    path: 'olvido-contrasena',
    loadComponent: () => import('@account/pages/forgot-password-page/forgot-password-page')
  },
  {
    path: 'restaurar-contrasena',
    loadComponent: () => import('@account/pages/reset-password-page/reset-password-page')
  },
]

export default authRoutes;
