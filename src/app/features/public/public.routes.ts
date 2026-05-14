import { Routes } from "@angular/router";
import { environment } from "@environments/environment.development";

const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@public/pages/main-page/main-page'),
    data: {
      seo: {
        title: 'Inicio',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/`
      }
    }
  },
  {
    path: 'nosotros',
    loadComponent: () => import('@public/pages/about-us-page/about-us-page'),
    data: {
      seo: {
        title: 'Nosotros',
        description: 'Conoce la historia, misión y visión de la ASADA, así como nuestro compromiso con la gestión responsable del agua en la comunidad.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/nosotros`
      }
    }
  },
  {
    path: 'junta-directiva',
    loadComponent: () => import('@public/pages/director-board-page/director-board-page'),
    data: {
      seo: {
        title: 'Junta directiva',
        description: 'Conoce a los miembros de la junta directiva, responsables de la toma de decisiones y la gestión de la ASADA.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/junta-directiva`
      }
    }
  },
  {
    path: 'galeria',
    loadComponent: () => import('@public/pages/gallery-page/gallery-page'),
    data: {
      seo: {
        title: 'Galería',
        description: 'Galería de imágenes que muestran trabajos realizados, mejoras, reparaciones y proyectos en el sistema de agua en beneficio de la comunidad.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/galeria`
      }
    }
  },
  {
    path: 'documentos',
    loadComponent: () => import('@public/pages/documents-page/documents-page'),
    data: {
      seo: {
        title: 'Documentos',
        description: 'Encuentra formularios, informes financieros y documentación técnica relacionada con el mantenimiento y operación del sistema de agua potable.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/documentos`
      }
    }
  },
  {
    path: 'noticias',
    loadComponent: () => import('@public/pages/news-page/news-page'),
    data: {
      seo: {
        title: 'Noticias',
        description: 'Ublicación de comunicados oficiales sobre la gestión, operación y mejoras del sistema de agua potable.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/noticias`
      }
    }
  },
  {
    path: 'noticia/:slug',
    loadComponent: () => import('@public/pages/individual-new-page/individual-new-page')
  },
  {
    path: 'contacto',
    loadComponent: () => import('@public/pages/contact-page/contact-page'),
    data: {
      seo: {
        title: 'Contacto',
        description: 'Formulario y medios de contacto disponibles para comunicarte con la ASADA de forma rápida y sencilla.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/contacto`
      }
    }
  },
  {
    path: 'recibos',
    loadComponent: () => import('@public/pages/receipts-page/receipts-page'),
    data: {
      seo: {
        title: 'Recibos',
        description: 'Consulta tus recibos, conoce tu consumo y verifica el estado de tus pagos de forma rápida y segura.',
        type: 'website',
        noIndex: false,
        url: `${environment.APP_URL}/recibos`
      }
    }
  },
  {
    path: 'buscador',
    loadComponent: () => import('@public/pages/main-page/main-page'),
    data: {
      seo: {
        title: 'Buscador',
        description: 'Realizar búsquedas sobre piezas importantes para la ASADA, como documentos, noticias e imágenes.',
        type: 'website',
        noIndex: true,
        url: `${environment.APP_URL}/buscador`
      }
    }
  }
]

export default publicRoutes;
