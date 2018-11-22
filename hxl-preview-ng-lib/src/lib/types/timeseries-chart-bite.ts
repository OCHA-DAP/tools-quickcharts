import { ChartBite, ChartUIProperties } from './chart-bite';
import { AggregateFunctionOptions } from './ingredients';
import { BiteFilters, Ingredient } from './ingredient';

export class TimeseriesChartBite extends ChartBite {
  static type(): string {
    return 'timeseries';
  }

  constructor(ingredient: Ingredient) {

    super(ingredient);
    this.displayCategory = 'Timeseries';

    this.uiProperties = new TimeseriesChartUIProperties();
  }
}

export class TimeseriesChartUIProperties extends ChartUIProperties {

  public showPoints = false;

  constructor() {
    super();
  }
}
