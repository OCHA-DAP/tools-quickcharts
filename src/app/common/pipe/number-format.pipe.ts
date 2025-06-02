import { UnitsUtil } from 'hxl-preview-ng-lib';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
    standalone: false
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, format: string, unit: string, decimals?: number): string {
    const newValue: number = +UnitsUtil.transform(value, decimals, unit);
    if (format) {
      const options: Intl.NumberFormatOptions = {};
      if (decimals != null) {
        options.minimumFractionDigits = decimals;
        options.maximumFractionDigits = decimals;
      }
      return newValue.toLocaleString(format, options);
    }

    return newValue + '';
  }
}
