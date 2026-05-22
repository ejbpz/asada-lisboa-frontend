import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'public-hero-section',
  imports: [RouterLink, UpperCasePipe, TitleCasePipe],
  templateUrl: './public-hero-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center pt-12.5 md:px-12'
  }
})
export class PublicHeroSection {
  // Default values
  protected title: string = 'asada';
  protected subtitle: string = 'urbanización lisboa';
  protected description: string = 'Administramos el servicio de agua potable en Urbanización Lisboa, ofreciendo a la comunidad un acceso seguro, continuo y transparente al recurso más importante: <span class="text-primary font-semibold">el agua</span>.';

  protected cta = {
    link: '/noticias',
    title: 'noticias'
  };
}
