import { RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

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
  // Init
  protected generateContent = GenerateContent;
  protected data = signal<ImageMinimalResponse[] | undefined>(undefined);

  // Input signal
  public images = input.required<ImageMinimalResponse[] | undefined>();

  // Effects
  protected imageReduced = effect(() => {
    this.data.set(this.images()?.slice(3));
  });

  // Default values
  protected title: string = 'asada';
  protected subtitle: string = 'urbanización lisboa';
  protected description: string = 'Administramos el servicio de agua potable en Urbanización Lisboa, ofreciendo a la comunidad un acceso seguro, continuo y transparente al recurso más importante: <span class="text-primary font-semibold">el agua</span>.';

  protected cta = {
    link: '/noticias',
    title: 'noticias'
  };

  // Template methods
  protected getImageClasses(index: number): string {
    const base = 'rounded-lg shadow-md object-cover w-full h-full';

    switch (index) {
      case 0:
        return `${base} row-start-2 row-span-3`;
      case 1:
        return `${base} col-start-2 row-span-2`;
      case 2:
        return `${base} col-start-2 row-start-3 row-span-3`;
      default:
        return base;
    }
  }
}
