import { BiteLogic } from './bite-logic';
import { ChartBite } from './chart-bite';

export class ChartBiteLogic extends BiteLogic {

  constructor(protected bite: ChartBite) {
    super(bite);
  }

  public resetBite(): ChartBiteLogic {
    this.bite.values = null;
    this.bite.categories = null;
    super.resetBite();

    return this;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): ChartBiteLogic {
    super.populateDataTitleWithHxlProxyInfo(hxlData, tagToTitleMap);

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);

    if ( aggColIndex >= 0 && valColIndex >= 0) {

      this.bite.values = [this.bite.dataTitle];
      this.bite.categories = [];

      for (let i = 2; i < hxlData.length; i++) {
        this.bite.values.push(hxlData[i][valColIndex]);
        this.bite.categories.push(hxlData[i][aggColIndex]);
      }

      this.bite.init = true;
    } else {
      throw `${this.bite.ingredient.valueColumn} or ${this.bite.ingredient.aggregateColumn}`
          + 'not found in hxl proxy response';
    }
    return this;
  }

  public unpopulateBite(): BiteLogic {
    this.bite.values = null;
    this.bite.categories = null;
    return super.unpopulateBite();
  }

}

