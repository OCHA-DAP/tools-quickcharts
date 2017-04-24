import { Bite } from './bite';
import { Ingredient } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class KeyFigureBite extends Bite {
  // HXL Proxy generated: value
  public value: number;

  /**
   * User properties
   */
  // text preceding "value"
  public preText: string;
  // text after "value"
  public postText: string;
  // description of key figure
  public description: string;

  public numberFormat: string;

  get formattedValue(): string {
    if (this.numberFormat) {
      return this.value.toLocaleString(this.numberFormat);
    }
    return this.value + '';
  }

  static type(): string {
    return 'key figure';
  }

  constructor(valueColumn: string, aggregateFunction: AggregateFunctionOptions, title?: string) {
    super(title);
    this.ingredient = new Ingredient(null, valueColumn, aggregateFunction);
    this.dataTitle = valueColumn;
    this.displayCategory = 'Key Figures';
  }

}
