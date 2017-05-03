import {Bite} from './bite';
import { Ingredient } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class ChartBite extends Bite {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  public swapAxis = true;
  public showGrid = true;
  public pieChart = false;

  static type(): string {
    return 'chart';
  }

  constructor(aggregateColumn: string, valueColumn: string, aggregateFunction: AggregateFunctionOptions, title?: string) {
    super(title);
    this.ingredient = new Ingredient(aggregateColumn, valueColumn, aggregateFunction);
    this.dataTitle = valueColumn;
    this.displayCategory = 'Charts';
  }
}
