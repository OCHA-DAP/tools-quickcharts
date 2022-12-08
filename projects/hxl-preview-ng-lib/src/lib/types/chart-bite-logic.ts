import { ChartType } from './ingredients';
import { BiteLogic, ColorUsage } from './bite-logic';
import { ChartBite, ChartDataProperties, ChartUIProperties, ChartComputedProperties } from './chart-bite';

export class ChartBiteLogic extends BiteLogic {

  constructor(protected bite: ChartBite) {
    super(bite);
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): ChartBiteLogic {
    super.populateDataTitleWithHxlProxyInfo();

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);

    const dataProperties = this.bite.dataProperties as ChartDataProperties;
    const computedProperties = this.bite.computedProperties as ChartComputedProperties;
    if ( aggColIndex >= 0 && valColIndex >= 0) {

      dataProperties.values = [computedProperties.dataTitle];
      dataProperties.categories = [];

      for (let i = 2; i < hxlData.length; i++) {
        dataProperties.values.push(hxlData[i][valColIndex]);
        dataProperties.categories.push(hxlData[i][aggColIndex]);
      }

      computedProperties.pieChart = !(dataProperties.values.length > 5);

    } else {
      throw new Error(`${this.bite.ingredient.valueColumn} or ${this.bite.ingredient.aggregateColumn}`
          + 'not found in hxl proxy response');
    }
    return this;
  }

  public initUIProperties(): ChartUIProperties {
    return new ChartUIProperties();
  }
  public initComputedProperties(): ChartComputedProperties {
    return new ChartComputedProperties();
  }
  public initDataProperties(): ChartDataProperties {
    return new ChartDataProperties();
  }

  public colorUsage(): ColorUsage {
    if (this.pieChart) {
      return ColorUsage.NONE;
    }
    return ColorUsage.ONE;
  }

  public initColorsIfNeeded(colorPattern: string[]): void {
    super.initColorsIfNeeded(colorPattern);
    if (!this.uiProperties.color) {
      this.uiProperties.color = colorPattern[0];
    }
  }

  public isGroupedByDateColumn(): boolean {
    if (this.bite.ingredient.aggregateColumn) {
      return this.bite.ingredient.aggregateColumn.indexOf('#date') >= 0;
    }
    return false;
  }

  public hasData(): boolean {
    // for pie charts we need at least 2 values (plus the title)
    if (this.values != null && this.values.length >= 3) {
      return true;
    }
    return false;
  }

  public get dataProperties(): ChartDataProperties {
    return this.bite.dataProperties as ChartDataProperties;
  }

  public get uiProperties(): ChartUIProperties {
    return this.bite.uiProperties as ChartUIProperties;
  }

  public get computedProperties(): ChartComputedProperties {
    return this.bite.computedProperties as ChartComputedProperties;
  }

  public get pieChart(): boolean {
    const computedProperties = this.computedProperties;
    const pieChart = this.forcedChartType ?
                    this.forcedChartType === 'pie' : computedProperties.pieChart;

    return pieChart;
  }

  public get forcedChartType(): ChartType {
    if (this.recipeOptions) {
      return this.recipeOptions.forcedChartType;
    }
    return undefined;
  }

  public get swapAxis(): boolean {
    return this.uiProperties.swapAxis;
  }

  public get showGrid(): boolean {
    return this.uiProperties.showGrid;
  }

  public get color(): string {
    return this.uiProperties.color;
  }

  public get sortingByValue1(): string {
    return this.uiProperties.sortingByValue1;
  }

  public set sortingByValue1(sortingByValue1: string) {
    if (sortingByValue1) {
      this.uiProperties.sortingByCategory1 = null;
    }
    this.uiProperties.sortingByValue1 = sortingByValue1;
  }

  public get sortingByCategory1(): string {
    if (this.sortingByValue1) {
      return null;
    }
    return this.uiProperties.sortingByCategory1;
  }

  public set sortingByCategory1(sortingByCategory1: string) {
    if (sortingByCategory1) {
      this.uiProperties.sortingByValue1 = null;
    }
    this.uiProperties.sortingByCategory1 = sortingByCategory1;
  }

  public get limit(): number {
    return this.uiProperties.limit;
  }

  public get actualNumOfUsedValues(): number {
    if (this.values.length > MAX_LIMIT_VALUE && (!this.limit || this.limit > MAX_LIMIT_VALUE)) {
      this.uiProperties.limit = MAX_LIMIT_VALUE;
      return MAX_LIMIT_VALUE;
    }

    if (this.limit && this.limit < this.values.length) {
      return this.limit;
    }

    return this.values.length;
  }

  public get categories(): string[] {
    return this.dataProperties.categories;
  }

  public get values(): any[] {
    return this.dataProperties.values;
  }

  public get sortingByValue1Label(): string {
    return 'Sort by values';
  }

  public get sortingByValue2Label(): string {
    return null;
  }

  public get sortingByCategory1Label(): string {
    return 'Sort by category';
  }

}

export const MAX_LIMIT_VALUE = 100;
