import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'title-section',
  imports: [],
  templateUrl: './title-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block mb-5 w-full md:w-1/2'
  }
})
export class TitleSection {
  public link = input.required<string>();

  public hasReturn = input(false, {
    transform: (value: boolean | string) => {
      return typeof value === 'string' ? value === '' : false;
    }
  });
}
