import { UnitsUtil } from 'hxl-preview-ng-lib';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
    standalone: false
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, decimals: number, unit: string): string {
    return UnitsUtil.transform(value, decimals, unit);
  }
}
