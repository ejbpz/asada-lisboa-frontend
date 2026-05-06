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
    loadComponent: () => import('@admin/pages/admin-update-user-page/admin-update-user-page')
  },
  {
    path: 'imagenes',
    loadComponent: () => import('@admin/pages/admin-images-page/admin-images-page')
  },
  // {
  //   path: 'imagen',
  //   //loadComponent: () => import('') // TODO
  // },
  // {
  //   path: 'imagen/:id',
  //   //loadComponent: () => import('') // TODO
  // },
  {
    path: 'documentos',
    loadComponent: () => import('@admin/pages/admin-documents-page/admin-documents-page')
  },
  {
    path: 'documento',
    loadComponent: () => import('@admin/pages/admin-individual-document-page/admin-individual-document-page')
  },
  {
    path: 'documento/:id',
    loadComponent: () => import('@admin/pages/admin-individual-document-page/admin-individual-document-page')
  },
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
