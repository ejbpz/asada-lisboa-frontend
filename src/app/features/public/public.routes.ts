import { Routes } from "@angular/router";

const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@public/pages/main-page/main-page')
  },
  // {
  //   path: 'nosotros',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'junta-directiva',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'galeria',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'galeria/:slug',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'documentos',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'documento/:slug',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'noticias',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'noticia/:slug',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'contacto',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'recibos',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'buscador',
  //   //loadComponent: () => import('') // TODO
  // }
]

export default publicRoutes;
