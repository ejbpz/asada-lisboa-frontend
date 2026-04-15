import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleSection } from "@shared/components/title-section/title-section";

@Component({
  selector: 'public-images-section',
  imports: [TitleSection],
  templateUrl: './public-images-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class PublicImagesSection {
  protected imagesSources: string[] = [
    'https://asadalisboa.org/images/galeria/Tanques/tanque1-1.jpg',
    'https://asadalisboa.org/images/galeria/Tanques/tanque20.jpg',
    'https://asadalisboa.org/images/galeria/Tanques/tanque1-4.jpg',
    'https://asadalisboa.org/images/galeria/colindancia/1.jpg',
    'https://asadalisboa.org/images/galeria/pozo/1.jpg',
    'https://asadalisboa.org/images/galeria/proyectos_2022/prueba2.jpeg',
  ]
}
