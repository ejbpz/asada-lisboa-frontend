import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'public-footer',
  imports: [UpperCasePipe, TitleCasePipe],
  templateUrl: './public-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {
  protected title = 'asada';
  protected subtitle = 'urbanización lisboa';

  private year = new Date().getFullYear();
  protected copyright = `2021-${this.year}. ASADA de Urbanización Lisboa. Todos los derechos reservados`;

  protected facebookLink = 'https://www.facebook.com/asadalisboa/';

  protected contactLinks = [
    { title: 'Oficinas', imageUrl: 'assets/icons/location-icon.svg', description: 'Urbanización Lisboa', link: 'https://maps.app.goo.gl/kvGqGzzrC8gvcyTcA', type: '' },
    { title: 'Correo', imageUrl: 'assets/icons/mail-icon.svg', description: 'asadaurblisboa@gmail.com', link: 'asadaurblisboa@gmail.com', type: 'mailto:' },
    { title: 'Teléfono', imageUrl: 'assets/icons/phone-icon.svg', description: '+506 2433-3882', link: '+506 2433-3882', type: 'tel:' },
  ];
}
