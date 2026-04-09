import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-footer',
  imports: [UpperCasePipe],
  templateUrl: './admin-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFooter {
  private year = new Date().getFullYear();
  protected copyright = `2021-${this.year}. ASADA de Urbanización Lisboa. Todos los derechos reservados`;
}
