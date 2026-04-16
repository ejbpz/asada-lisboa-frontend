import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'nosotros/',
    renderMode: RenderMode.Server
  },
  {
    path: 'junta-directiva/',
    renderMode: RenderMode.Server
  },
  {
    path: 'galeria/',
    renderMode: RenderMode.Server
  },
  {
    path: 'galeria/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'documentos/',
    renderMode: RenderMode.Server
  },
  {
    path: 'documentos/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'noticias/',
    renderMode: RenderMode.Server
  },
  {
    path: 'noticias/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'contacto/',
    renderMode: RenderMode.Server
  },
  {
    path: 'recibos/',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
