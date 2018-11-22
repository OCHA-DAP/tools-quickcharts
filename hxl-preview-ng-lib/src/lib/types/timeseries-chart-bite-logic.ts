import { TimeseriesChartUIProperties } from './timeseries-chart-bite';
import { ColorUsage } from './bite-logic';
import { ChartBiteLogic } from './chart-bite-logic';

export class TimeseriesChartBiteLogic extends ChartBiteLogic {

  public initUIProperties(): TimeseriesChartUIProperties {
    return new TimeseriesChartUIProperties();
  }

  public populateWithTitle(columnNames: string[], hxlTags: string[]): TimeseriesChartBiteLogic {
    super.populateWithTitle(columnNames, hxlTags);
    const dateColumn = columnNames[this.tagToIndexMap[this.bite.ingredient.dateColumn]];
    this.bite.computedProperties.title += ` by ${dateColumn}`;
    return this;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): ChartBiteLogic {
    super.populateDataTitleWithHxlProxyInfo();

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

  protected buildImportantPropertiesList(): string[] {
    const importantProperties = super.buildImportantPropertiesList();
    importantProperties.push(this.bite.ingredient.dateColumn);
    return importantProperties;
  }

  private multipleLinePopulateDataForChart(aggColIndex: number, hxlData: any[][], dateColIndex: number,
                        valColIndex: number) {
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

    this.dataProperties.values = values;
  }

  private simplePopulateDataForChart(dateColIndex: number, valColIndex: number, hxlData: any[][]): void {
    if (dateColIndex >= 0 && valColIndex >= 0) {

      const values = [this.bite.computedProperties.dataTitle];
      const categories = ['Date'];

      for (let i = 2; i < hxlData.length; i++) {
        values.push(hxlData[i][valColIndex]);
        categories.push(hxlData[i][dateColIndex]);
      }

      this.dataProperties.values = [categories, values];
    } else {
      throw new Error(`${this.bite.ingredient.valueColumn} or ${this.bite.ingredient.aggregateColumn}`
      + 'not found in hxl proxy response');
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

  public usesDateColumn(): boolean {
    // if (this.bite.ingredient.dateColumn) {
    //   return true;
    // }
    return true;
  }

  public colorUsage(): ColorUsage {
    if (this.bite.ingredient.aggregateColumn) {
      return ColorUsage.MANY;
    }
    return ColorUsage.ONE;
  }

  public initColorsIfNeeded(colorPattern: string[]): void {
    if (!this.uiProperties.internalColorPattern) {
      this.uiProperties.internalColorPattern = colorPattern;
    }
    if (!this.uiProperties.color) {
      this.uiProperties.color = colorPattern[1];
    }
  }

  public get uiProperties(): TimeseriesChartUIProperties {
    return this.bite.uiProperties as TimeseriesChartUIProperties;
  }

  public get showPoints(): boolean {
    return this.uiProperties.showPoints;
  }

  public set showPoints(showPoints: boolean) {
    this.uiProperties.showPoints = showPoints;
  }

  public get sortingByValue1Label(): string {
    return null;
  }

  public get sortingByValue2Label(): string {
    return null;
  }

  public get sortingByCategory1Label(): string {
    return null;
  }
}
