import { ChartBiteLogic } from './chart-bite-logic';

export class TimeseriesChartBiteLogic extends ChartBiteLogic {

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): ChartBiteLogic {
    super.populateDataTitleWithHxlProxyInfo(hxlData, tagToTitleMap);

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const dateColIndex = this.findHxlTagIndex(this.bite.ingredient.dateColumn, hxlData);

    if (this.bite.ingredient.aggregateColumn) {
      const aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);
      this.multipleLinePopulateDataForChart(aggColIndex, hxlData, dateColIndex, valColIndex);

    } else {
      this.simplePopulateDataForChart(dateColIndex, valColIndex, hxlData);
    }
    return this;
  }

  private multipleLinePopulateDataForChart(aggColIndex: number, hxlData: any[][], dateColIndex: number, valColIndex: number) {
    const foundGroups = this.findGroups(aggColIndex, hxlData);

    const values: any[][] = [];
    const groupToIdxMap = {};
    foundGroups.forEach((group, idx) => {
      values.push([group]);
      groupToIdxMap[group] = idx;
    });

    const dates = ['Date'];

    let prevDate = null;
    for (let i = 2; i < hxlData.length; i++) {
      const date = hxlData[i][dateColIndex];
      if (date !== prevDate) {
        prevDate = date;
        dates.push(date);
        values.forEach(groupList => groupList.push(0));
      }

      const group: string = hxlData[i][aggColIndex];
      if (group && group.trim()) {
        const val = hxlData[i][valColIndex];
        const valueList = values[groupToIdxMap[group]];
        valueList[valueList.length - 1] = val;
      }
    }

    values.splice(0, 0, dates);

    this.bite.values = values;
    this.bite.init = true;
  }

  private simplePopulateDataForChart(dateColIndex: number, valColIndex: number, hxlData: any[][]): void {
    if (dateColIndex >= 0 && valColIndex >= 0) {

      const values = [this.bite.dataTitle];
      const categories = ['Date'];

      for (let i = 2; i < hxlData.length; i++) {
        values.push(hxlData[i][valColIndex]);
        categories.push(hxlData[i][dateColIndex]);
      }

      this.bite.values = [categories, values];
      this.bite.init = true;
    } else {
      throw `${this.bite.ingredient.valueColumn} or ${this.bite.ingredient.aggregateColumn}`
      + 'not found in hxl proxy response';
    }
  }

  private findGroups(aggColIndex: number, hxlData: any[][]): string[] {
    const mySet: Set<string> = new Set();

    for (let i = 2; i < hxlData.length; i++) {
      const group: string = hxlData[i][aggColIndex];
      if (group && group.trim()) {
        mySet.add(group.trim());
      }
    }

    const result: string[] = [];
    mySet.forEach(item => result.push(item));
    return result;
  }
}
