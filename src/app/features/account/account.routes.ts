import { Routes } from "@angular/router";
import { nonAuthenticatedUserGuard } from "@core/guards/non-authenticated-user-guard";

const authRoutes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@account/pages/login-page/login-page'),
    canActivate: [nonAuthenticatedUserGuard],
    data: {
      seo: {
        title: 'Iniciar sesión',
        noIndex: true
      }
    }
  },
  {
    path: 'olvido-contrasena',
    loadComponent: () => import('@account/pages/forgot-password-page/forgot-password-page'),
    data: {
      seo: {
        title: 'Olvido contraseña',
        noIndex: true
      }
    }
  },
  {
    path: 'restaurar-contrasena',
    loadComponent: () => import('@account/pages/reset-password-page/reset-password-page'),
    data: {
      seo: {
        title: 'Restaurar contraseña',
        noIndex: true
      }
    }
  },
  {
    path: 'confirmar-correo',
    loadComponent: () => import('@account/pages/confirm-email-page/confirm-email-page'),
    data: {
      seo: {
        title: 'Confirmar correo',
        noIndex: true
      }
    }
  },
  {
    path: '**',
    redirectTo: 'iniciar-sesion'
  }
]

export default authRoutes;
