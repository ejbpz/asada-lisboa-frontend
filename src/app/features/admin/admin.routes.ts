import { Routes } from "@angular/router";

const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@admin/pages/admin-dashboard-page/admin-dashboard-page'), 
    data: {
      seo: {
        title: 'Panel administrativo',
        noIndex: true
      }
    }
  },
  {
    path: 'configuraciones',
    loadComponent: () => import('@admin/pages/admin-configurations-page/admin-configurations-page'),
    data: {
      seo: {
        title: 'Configuraciones',
        noIndex: true
      }
    }
  },
  {
    path: 'usuarios',
    loadComponent: () => import('@admin/pages/admin-director-board-page/admin-director-board-page'),
    data: {
      seo: {
        title: 'Usuarios',
        noIndex: true
      }
    }
  },
  {
    path: 'usuario',
    loadComponent: () => import('@admin/pages/admin-individual-user-page/admin-individual-user-page'),
    data: {
      seo: {
        title: 'Crear usuario',
        noIndex: true
      }
    }
  },
  {
    path: 'usuario/:id',
    loadComponent: () => import('@admin/pages/admin-update-user-page/admin-update-user-page'),
    data: {
      seo: {
        title: 'Actualizar usuario',
        noIndex: true
      }
    }
  },
  {
    path: 'imagenes',
    loadComponent: () => import('@admin/pages/admin-images-page/admin-images-page'),
    data: {
      seo: {
        title: 'Imágenes',
        noIndex: true
      }
    }
  },
  {
    path: 'imagen',
    loadComponent: () => import('@admin/pages/admin-individual-image-page/admin-individual-image-page'),
    data: {
      seo: {
        title: 'Crear imagen',
        noIndex: true
      }
    }
  },
  {
    path: 'imagen/:id',
    loadComponent: () => import('@admin/pages/admin-individual-image-page/admin-individual-image-page'),
    data: {
      seo: {
        title: 'Actualizar imagen',
        noIndex: true
      }
    }
  },
  {
    path: 'documentos',
    loadComponent: () => import('@admin/pages/admin-documents-page/admin-documents-page'),
    data: {
      seo: {
        title: 'Documentos',
        noIndex: true
      }
    }
  },
  {
    path: 'documento',
    loadComponent: () => import('@admin/pages/admin-individual-document-page/admin-individual-document-page'),
    data: {
      seo: {
        title: 'Crear documento',
        noIndex: true
      }
    }
  },
  {
    path: 'documento/:id',
    loadComponent: () => import('@admin/pages/admin-individual-document-page/admin-individual-document-page'),
    data: {
      seo: {
        title: 'Actualizar documento',
        noIndex: true
      }
    }
  },
  {
    path: 'noticias',
    loadComponent: () => import('@admin/pages/admin-news-page/admin-news-page'),
    data: {
      seo: {
        title: 'Noticias',
        noIndex: true
      }
    }
  },
  {
    path: 'noticia',
    loadComponent: () => import('@admin/pages/admin-individual-new-page/admin-individual-new-page'),
    data: {
      seo: {
        title: 'Crear noticia',
        noIndex: true
      }
    }
  },
  {
    path: 'noticia/:id',
    loadComponent: () => import('@admin/pages/admin-individual-new-page/admin-individual-new-page'),
    data: {
      seo: {
        title: 'Actualizar noticia',
        noIndex: true
      }
    }
  }
]

export default adminRoutes;
