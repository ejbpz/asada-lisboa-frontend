import { Routes } from "@angular/router";
import { nonAuthenticatedUserGuard } from "@core/guards/non-authenticated-user-guard";

const authRoutes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@account/pages/login-page/login-page'),
    canActivate: [nonAuthenticatedUserGuard]
  },
  // {
  //   path: 'olvido-contrasena',
  //   // loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'cambio-contrasena',
  //   // loadComponent: () => import('') // TODO
  // },
  {
    path: '**',
    redirectTo: 'iniciar-sesion'
  }
]

export default authRoutes;
