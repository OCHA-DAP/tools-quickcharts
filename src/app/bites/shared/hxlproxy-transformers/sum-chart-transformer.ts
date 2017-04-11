import { CountChartTransformer } from './count-chart-transformer';

export class SumChartTransformer extends CountChartTransformer {

  protected metaTagForAggColumn = '#meta+sum';

  protected nameForAggregatedValueColumn(): string {
    return this.valueTag;
  }

}
