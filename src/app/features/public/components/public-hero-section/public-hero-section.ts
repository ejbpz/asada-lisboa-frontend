import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'public-hero-section',
  imports: [RouterLink, UpperCasePipe, TitleCasePipe],
  templateUrl: './public-hero-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class PublicHeroSection {
  protected title: string = 'asada';
  protected subtitle: string = 'urbanización lisboa';
  protected description: string = 'Administramos el servicio de agua potable en Urbanización Lisboa, ofreciendo a la comunidad un acceso seguro, continuo y transparente al recurso más importante: <span class="text-primary font-semibold">el agua</span>.';

  protected cta = {
    link: '/noticias',
    title: 'noticias'
  };

  protected e = input.required<{ [key: string]: string | null }>

  // TODO: Input images from principal and its alt.
  protected imagesSources: string[] = [
    'https://asadalisboa.org/images/galeria/Tanques/tanque1-1.jpg',
    'https://asadalisboa.org/images/galeria/Tanques/tanque20.jpg',
    'https://asadalisboa.org/images/galeria/Tanques/tanque1-4.jpg',
  ]
}
