import {Bite} from './bite';
import { Ingredient } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class ChartBite extends Bite {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  static type(): string {
    return 'chart';
  }

  constructor(title: string, aggregateColumn: string, valueColumn: string, aggregateFunction: AggregateFunctionOptions) {
    super(title, ChartBite.type());
    this.ingredient = new Ingredient(aggregateColumn, valueColumn, aggregateFunction);
    this.dataTitle = valueColumn;
  }
}
