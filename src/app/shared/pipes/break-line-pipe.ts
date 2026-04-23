import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakLine',
})
export class BreakLinePipe implements PipeTransform {
  transform(value: string): string {
    return value?.replaceAll('\\n', '<br/>');
  }
}
