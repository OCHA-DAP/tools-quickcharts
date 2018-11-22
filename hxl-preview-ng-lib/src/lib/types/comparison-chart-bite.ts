import { AggregateFunctionOptions } from './ingredients';
import { BiteFilters, Ingredient } from './ingredient';
import {ChartBite, ChartComputedProperties, ChartDataProperties, ChartUIProperties} from './chart-bite';

export class ComparisonChartBite extends ChartBite {

  static type(): string {
    return 'comparison-chart';
  }

  constructor(ingredient: Ingredient) {
    super(ingredient);
    this.dataProperties = new ComparisonChartDataProperties();
    this.uiProperties = new ComparisonChartUIProperties();
    this.computedProperties = new ComparisonChartComputedProperties();

  }

}
export class ComparisonChartDataProperties extends ChartDataProperties {
  // HXL Proxy generated: values
  public comparisonValues: any[];
}

export class ComparisonChartComputedProperties extends ChartComputedProperties {
    public comparisonDataTitle: string;
}

export class ComparisonChartUIProperties extends ChartUIProperties {
  public stackChart = false;
  public comparisonDataTitle: string;
  public comparisonColor: string = null;
  public sortingByValue2: string = null;
}


