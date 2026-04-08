import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'public-navbar',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbar {
  logo: { image: string, alt: string } = {
    image: 'logo/asada-logo.svg',
    alt: 'ASADA Lisboa logo',
  }

      // <li>
      //   <details>
      //     <summary>Nosotros</summary>
      //     <ul class="p-2 bg-base-100 w-40 mt-8 z-1">
      //     <li><a>¿Quiénes somos?</a></li>
      //     <li><a>Junta directiva</a></li>
      //     </ul>
      //   </details>
      // </li>
      // <li><a>Galería</a></li>
      // <li><a>Documentos</a></li>
      // <li><a>Noticias</a></li>
      // <li><a>Contacto</a></li>
      // <li><a>Recibos</a></li>
      // <li><a>Iniciar Sesión</a></li>

  navigation = [
    { title: 'Nosotros', internal:
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
