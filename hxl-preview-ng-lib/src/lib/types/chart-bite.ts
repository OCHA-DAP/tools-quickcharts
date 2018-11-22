import { Bite, UIProperties, ComputedProperties, DataProperties } from './bite';
import { Ingredient, BiteFilters } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class ChartBite extends Bite {
  static colorPattern = ['#1ebfb3', '#0077ce', '#f2645a', '#9C27B0'];
  static SORT_DESC = 'DESC';
  static SORT_ASC = 'ASC';

  static type(): string {
    return 'chart';
  }

  constructor(ingredient: Ingredient) {
    super(ingredient);
    this.computedProperties = new ChartComputedProperties();
    this.uiProperties = new ChartUIProperties();
    this.dataProperties = new ChartDataProperties();
    this.displayCategory = 'Charts';
  }
}


export class ChartUIProperties extends UIProperties {
  public swapAxis = true;
  public showGrid = false;

  public color: string = null;
  public sortingByValue1: string = ChartBite.SORT_DESC;
  public sortingByCategory1: string = null;
  public limit: number;
}

export class ChartComputedProperties extends ComputedProperties {
  public pieChart = false;
}

export class ChartDataProperties extends DataProperties {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];
}
