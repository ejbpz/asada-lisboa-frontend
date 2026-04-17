import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'get-back-title',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './get-back-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col justify-center items-center'
  }
})
export class GetBackTitle {
  // Input signals
  public isAdmin = input(false, {
    transform: (value: boolean | string) => {
      return typeof value === 'string' ? value === '' : value;
    }
  });

  public link = input<string | undefined>(undefined);

  public title = input<string | undefined>('Volver');
}
