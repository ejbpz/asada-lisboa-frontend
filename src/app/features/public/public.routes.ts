import { Routes } from "@angular/router";

const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@public/pages/main-page/main-page')
  },
  {
    path: 'nosotros',
    loadComponent: () => import('@public/pages/about-us-page/about-us-page')
  },
  {
    path: 'junta-directiva',
    loadComponent: () => import('@public/pages/director-board-page/director-board-page')
  },
  {
    path: 'galeria',
    loadComponent: () => import('@public/pages/gallery-page/gallery-page')
  },
  {
    path: 'documentos',
    loadComponent: () => import('@public/pages/documents-page/documents-page')
  },
  {
    path: 'noticias',
    loadComponent: () => import('@public/pages/news-page/news-page')
  },
  {
    path: 'noticia/:slug',
    loadComponent: () => import('@public/pages/main-page/main-page')
  },
  {
    path: 'contacto',
    loadComponent: () => import('@public/pages/contact-page/contact-page')
  },
  {
    path: 'recibos',
    loadComponent: () => import('@public/pages/main-page/main-page')
  },
  {
    path: 'buscador',
    loadComponent: () => import('@public/pages/main-page/main-page')
  }
]

export default publicRoutes;
