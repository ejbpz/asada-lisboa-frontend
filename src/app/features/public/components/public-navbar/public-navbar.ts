import { TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ChangeDetectionStrategy, Component, inject, signal, effect, computed } from '@angular/core';
import { AuthApi } from '@core/services/auth-api';

@Component({
  selector: 'public-navbar',
  imports: [TitleCasePipe, RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-screen fixed top-0 left-0 z-100 bg-neutral-content shadow-sm flex justify-center rounded-b-sm rounded-t-none'
  }
})
export class PublicNavbar {
  // Injection
  private authApi = inject(AuthApi);

  // Init
  navigationLinks = [
    { title: 'Nosotros', internalLinks:
      [
        { title: '¿Quiénes somos?', link: 'nosotros' },
        { title: 'Junta directiva', link: 'junta-directiva' }
      ]
    },
    { title: 'Galería', link: 'galeria' },
    { title: 'Documentos', link: 'documentos' },
    { title: 'Noticias', link: 'noticias' },
    { title: 'Contacto', link: 'contacto' },
    { title: 'Recibos', link: 'recibos' },
  ];

  protected authLink = computed(() => {
    return this.authApi.isAuthenticated()
      ? { title: 'Panel Administrativo', link: 'admin' }
      : { title: 'Iniciar Sesión', link: 'cuenta/iniciar-sesion' };
  });
}
