import { Routes } from "@angular/router";

const adminRoutes: Routes = [
  // {
  //   path: '',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'configuraciones',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'usuarios',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'usuario/:id',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'galeria',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'galeria/:id',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'documentos',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'documento/:id',
  //   //loadComponent: () => import('') // TODO
  // },
  {
    path: 'noticias',
    loadComponent: () => import('@admin/pages/admin-news-page/admin-news-page')
  },
  // {
  //   path: 'noticia/:id',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'buscador',
  //   //loadComponent: () => import('') // TODO
  // }
]

export default adminRoutes;
