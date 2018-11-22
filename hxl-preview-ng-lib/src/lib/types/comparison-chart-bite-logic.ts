import {BiteLogic, ColorUsage} from './bite-logic';
import {
    ComparisonChartBite,
    ComparisonChartComputedProperties,
    ComparisonChartDataProperties,
    ComparisonChartUIProperties
} from './comparison-chart-bite';
import { ChartBiteLogic } from './chart-bite-logic';

export class ComparisonChartBiteLogic extends ChartBiteLogic {

  constructor(protected bite: ComparisonChartBite) {
    super(bite);
  }

  protected buildImportantPropertiesList(): string[] {
    const importantProperties = super.buildImportantPropertiesList();
    importantProperties.push(this.bite.ingredient.comparisonValueColumn, this.bite.ingredient.comparisonOperator);
    return importantProperties;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): ComparisonChartBiteLogic {
    super.populateWithHxlProxyInfo(hxlData, tagToTitleMap);
    this.computedProperties.pieChart = false;

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const compColIndex = this.findHxlTagIndex(this.bite.ingredient.comparisonValueColumn, hxlData);

    if ( compColIndex >= 0) {
      this.dataProperties.comparisonValues = [this.bite.ingredient.comparisonValueColumn];

      for (let i = 2; i < hxlData.length; i++) {
        let computedValue = hxlData[i][compColIndex];

        // If we have more than 1 row of data
        // if (hxlData.length > 3) {
        //   computedValue = computedValue - hxlData[i][valColIndex];
        // }

        this.dataProperties.comparisonValues.push(computedValue);
      }
    } else {
      throw new Error(`${this.bite.ingredient.comparisonValueColumn}` + ' not found in hxl proxy response');
    }

    return this;
  }

  protected populateDataTitleWithHxlProxyInfo(): BiteLogic {
    super.populateDataTitleWithHxlProxyInfo();
      let computedProperties: ComparisonChartComputedProperties = (<ComparisonChartComputedProperties>this.bite.computedProperties);
      if (!computedProperties.comparisonDataTitle) {
          let ingredient = this.bite.ingredient;
          computedProperties.comparisonDataTitle = ingredient.comparisonValueColumn;
      }
    return this;
  }


  public populateWithTitle(columnNames: string[], hxlTags: string[]): BiteLogic {
    super.populateWithTitle(columnNames, hxlTags);
    let computedProperties: ComparisonChartComputedProperties = (<ComparisonChartComputedProperties>this.bite.computedProperties);
    const availableTags = {};
    hxlTags.forEach((v, idx) => availableTags[v] = idx);

    let ingrValColumn = this.bite.ingredient.comparisonValueColumn;
    const valueColumn = columnNames[availableTags[ingrValColumn]];
    const hxlValueColumn = hxlTags[availableTags[ingrValColumn]];
    computedProperties.comparisonDataTitle = (valueColumn && valueColumn.length > 0 ) ? valueColumn : hxlValueColumn;
    return this;
  }

  public initUIProperties(): ComparisonChartUIProperties {
    return new ComparisonChartUIProperties();
  }

  public initDataProperties(): ComparisonChartDataProperties {
    return new ComparisonChartDataProperties();
  }

  public colorUsage(): ColorUsage {
    return ColorUsage.MANY;
  }

  public initColorsIfNeeded(colorPattern: string[]): void {
    super.initColorsIfNeeded(colorPattern);
    if (!this.uiProperties.comparisonColor) {
      this.uiProperties.comparisonColor = colorPattern[1];
    }
  }

  public get dataProperties(): ComparisonChartDataProperties {
    return this.bite.dataProperties as ComparisonChartDataProperties;
  }

  public get uiProperties(): ComparisonChartUIProperties {
    return this.bite.uiProperties as ComparisonChartUIProperties;
  }

  public get valueColumns(): string[] {
    return [
      this.bite.ingredient.valueColumn,
      this.bite.ingredient.comparisonValueColumn
    ];
  }

  public get comparisonValues(): any[] {
    return this.dataProperties.comparisonValues;
  }

  public get stackChart(): boolean {
    return this.uiProperties.stackChart;
  }

  public get comparisonDataTitle(): string {
    let uiProperties: ComparisonChartUIProperties = (<ComparisonChartUIProperties>this.bite.uiProperties);
    let computedProperties: ComparisonChartComputedProperties = (<ComparisonChartComputedProperties>this.bite.computedProperties);

    const defaultDataTitle = computedProperties.comparisonDataTitle;
    const comparisonDataTitle = uiProperties.comparisonDataTitle == null ? defaultDataTitle : uiProperties.comparisonDataTitle;
    return comparisonDataTitle;
  }

  public get comparisonColor(): string {
    return this.uiProperties.comparisonColor;
  }

  public get sortingByValue1(): string {
    return this.uiProperties.sortingByValue1;
  }

  public set sortingByValue1(sortingByValue1: string) {
    if (sortingByValue1) {
      this.uiProperties.sortingByCategory1 = null;
      this.uiProperties.sortingByValue2 = null;
    }
    this.uiProperties.sortingByValue1 = sortingByValue1;
  }

  public get sortingByCategory1(): string {
    if (this.sortingByValue1 || this.sortingByValue2) {
      return null;
    }
    return this.uiProperties.sortingByCategory1;
  }

  public set sortingByCategory1(sortingByCategory1: string) {
    if (sortingByCategory1) {
      this.uiProperties.sortingByValue1 = null;
      this.uiProperties.sortingByValue2 = null;
    }
    this.uiProperties.sortingByCategory1 = sortingByCategory1;
  }

  public get sortingByValue2(): string {
    if (this.sortingByValue1) {
      return null;
    }
    return this.uiProperties.sortingByValue2;
  }

  public set sortingByValue2(sortingByValue2: string) {
    if (sortingByValue2) {
      this.uiProperties.sortingByCategory1 = null;
      this.uiProperties.sortingByValue1 = null;
    }
    this.uiProperties.sortingByValue2 = sortingByValue2;
  }

  public get sortingByValue1Label(): string {
    return 'Sort by values 1';
  }

  public get sortingByValue2Label(): string {
    return 'Sort by values 2';
  }

}
