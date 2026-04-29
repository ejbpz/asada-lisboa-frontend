import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Search} from '@shared/pages/search/search';

@Component({
  selector: 'public-navbar',
  imports: [TitleCasePipe, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-screen fixed top-0 left-0 z-1 bg-neutral-content shadow-sm flex justify-center rounded-b-sm rounded-t-none'
  }
})
export class PublicNavbar {
  
search = inject(Search);

  // Estado para mostrar/ocultar la búsqueda
  isSearchOpen = signal(false);
  
   showSearch = signal(false);

  isOpen = false;

   protected cta = {
    link: '/buscador',
    title: 'buscar'
  };

  // toggleSearch() {
  // this.isOpen = !this.isOpen;
  // } 

    toggleSearch() {
    this.showSearch.update(value => !value);
  }


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
