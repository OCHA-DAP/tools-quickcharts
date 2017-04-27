import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, format: string, unit: string): string {
    const modifiedValue = this.computeValueBasedOnUnit(value, unit);
    if (format) {
      return modifiedValue.toLocaleString(format);
    }
    return modifiedValue + '';
  }

  private computeValueBasedOnUnit(value: number, unit: string) {
    if (unit) {
      let newValue = value;
      switch (unit) {
        case 'k':
          newValue = newValue / 1000.0 ;
          break;
        case 'mln':
          newValue = newValue / 1000000.0 ;
          break;
        case 'bln':
          newValue = newValue / 1000000000.0 ;
          break;
      }
      /* Keep only one decimal value  */
      return Math.round(newValue * 10.0) / 10.0;
    }

    return value;
  }
}
