import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, format: string): string {
    if (format) {
      return value.toLocaleString(format);
    }
    return value + '';
  }

}
