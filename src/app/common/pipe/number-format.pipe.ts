import { UnitsUtil } from 'hxl-preview-ng-lib';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, format: string, unit: string): string {
    return UnitsUtil.transform(value, format, unit);
  }
}
