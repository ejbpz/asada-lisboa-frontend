import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'public-navbar',
  imports: [TitleCasePipe, RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-screen fixed top-0 left-0 z-1 bg-neutral-content shadow-sm flex justify-center rounded-b-sm rounded-t-none'
  }
})
export class PublicNavbar {
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
    { title: 'Iniciar Sesión', link: 'cuenta/iniciar-sesion' },
  ]
}
