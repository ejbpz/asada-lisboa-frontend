import { Routes } from "@angular/router";

const authRoutes: Routes = [
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('@account/pages/login-page/login-page')
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
