import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'global-footer',
  imports: [UpperCasePipe],
  templateUrl: './global-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalFooter {
  private year = new Date().getFullYear();
  protected copyright = `2021-${this.year}. ASADA de Urbanización Lisboa. Todos los derechos reservados`;
}
