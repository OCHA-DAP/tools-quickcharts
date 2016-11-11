import {Bite} from './bite';
import { Ingredient } from './ingredient';

export class ChartBite extends Bite {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  static type(): string {
    return 'chart';
  }

  constructor(title: string, aggregateColumn: string, valueColumn: string) {
    super(title, ChartBite.type());
    this.ingredient = new Ingredient(aggregateColumn, valueColumn);
    this.dataTitle = valueColumn;
  }
}
