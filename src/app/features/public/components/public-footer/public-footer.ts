import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'public-footer',
  imports: [],
  templateUrl: './public-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter { }
