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
  {
    path: 'usuarios',
    loadComponent: () => import('@admin/pages/admin-director-board-page/admin-director-board-page')
  },
  {
    path: 'usuario',
    loadComponent: () => import('@admin/pages/admin-individual-user-page/admin-individual-user-page')
  },
  {
    path: 'usuario/:id',
    loadComponent: () => import('@admin/pages/admin-individual-user-page/admin-individual-user-page')
  },
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
  {
    path: 'noticia',
    loadComponent: () => import('@admin/pages/admin-individual-new-page/admin-individual-new-page')
  },
  {
    path: 'noticia/:id',
    loadComponent: () => import('@admin/pages/admin-individual-new-page/admin-individual-new-page')
  }
]

export default adminRoutes;
