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

export const DEFAULT_DATE_FORMAT = '%d %b %Y';

export class TimeseriesChartUIProperties extends ChartUIProperties {

  public showPoints = false;
  public showAllDates = false;
  public dateFormat = DEFAULT_DATE_FORMAT;

  constructor() {
    super();
  }
}
