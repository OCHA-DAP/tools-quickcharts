import { ChartBite } from './chart-bite';
import { AggregateFunctionOptions } from './ingredients';

export class TimeseriesChartBite extends ChartBite {
  static type(): string {
    return 'timeseries';
  }

  constructor(dateColumn: string, aggregateColumn: string, valueColumn: string,
              aggregateFunction: AggregateFunctionOptions, title?: string) {

    super(aggregateColumn, valueColumn, aggregateFunction, title);
    this.ingredient.dateColumn = dateColumn;
    this.displayCategory = 'Timeseries';
  }
}
