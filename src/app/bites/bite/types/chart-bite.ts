import {Bite} from './bite';

export class ChartBite extends Bite {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  static type(): string {
    return 'chart';
  }

  constructor(title: string, dataTitle?: string, aggColumn?: string) {
    super(title, ChartBite.type());
    this.dataTitle = dataTitle;

    this.ingredient = {aggregateColumn: aggColumn, valueColumn: this.dataTitle};
  }


  public resetBite(): Bite {
    this.values = null;
    this.categories = null;
    return super.resetBite();
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): ChartBite {
    super.populateWithHxlProxyInfo(hxlData, tagToTitleMap);

    let valColIndex = this.findHxlTagIndex(this.ingredient.valueColumn, hxlData);
    let aggColIndex = this.findHxlTagIndex(this.ingredient.aggregateColumn, hxlData);

    if ( aggColIndex >= 0 && valColIndex >= 0) {

      this.values = [this.dataTitle];
      this.categories = [];

      for (let i = 2; i < hxlData.length; i++) {
        this.values.push(hxlData[i][valColIndex]);
        this.categories.push(hxlData[i][aggColIndex]);
      }

      this.init = true;
    } else {
      throw `${this.ingredient.valueColumn} or ${this.ingredient.aggregateColumn} not found in hxl proxy response`;
    }
    return this;
  }
}
