import { ChartBite, ComparisonChartBiteLogic, ChartUIProperties } from 'hxl-preview-ng-lib';
import { ContentChartComponent, C3ChartConfig, CategValuesElement, ChartDataSorter } from './../content-chart/content-chart.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComparisonChartUIProperties } from 'hxl-preview-ng-lib/src/types/comparison-chart-bite';

@Component({
  selector: 'hxl-content-comparison-chart',
  templateUrl: './content-comparison-chart.component.html',
  styleUrls: ['./content-comparison-chart.component.less']
})
export class ContentComparisonChartComponent extends ContentChartComponent implements OnInit, AfterViewInit {

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    (this.bite.uiProperties as ChartUIProperties).sortingByValue1 = null; // No values sorting for comparison charts enabled
    super.ngAfterViewInit();
  }

  protected generateOptionsTooltip(config: C3ChartConfig) {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    const values = [
      cmpBiteLogic.values,
      cmpBiteLogic.comparisonValues
    ];
    config.tooltip = {
      format: {
        value: (value, ratio, id, index) => {
          let newValue = value;
          // if we have more than 1 row of data and this is a comparison value
          if (cmpBiteLogic.values.length > 2 && id === values[1][0] && cmpBiteLogic.stackChart) {
            newValue = value + values[0][index + 1];
          }
          return this.numberFormatter(newValue);
        }
      }
    };
  }

  protected generateOptions(): C3ChartConfig {
    const config = super.generateOptions();
    this.overwriteXAxisLabel();
    return config;
  }


  protected generateOptionsColor(config: C3ChartConfig) {
    let pattern = ChartBite.colorPattern;

    // added check for this.bite.color since saved bites might not have any
    const biteLogic: ComparisonChartBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    if (biteLogic.color || biteLogic.comparisonDataTitle) {
      pattern = [biteLogic.color, biteLogic.comparisonColor];
    }
    config.color = {
      pattern: pattern
    };
  }

  protected overwriteXAxisLabel() {
    super.overwriteXAxisLabel();
    if (this.biteLogic.dataTitle && !this.biteLogic.pieChart) {
      const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
      const cmpUIProp = this.bite.uiProperties as ComparisonChartUIProperties;
      cmpBiteLogic.comparisonValues[0] = cmpBiteLogic.comparisonDataTitle;
    }
  }

  protected generateOptionsData(config: C3ChartConfig) {
    super.generateOptionsData(config);

    const dataSorter = this.dataSorter;
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;

    const values = [
      dataSorter.getSortedValues(),
      dataSorter.getSortedComparisonValues()
    ];

    config.data.columns = values;

    // if we have more than 1 row of data
    if (cmpBiteLogic.values.length > 2 && cmpBiteLogic.stackChart) {
      config.data.groups = [[
        values[0][0],
        values[1][0]
      ]];
      config.data.order = null; // stack the values in the order that they are given in config.data.columns
    }
  }

  protected generateOptionsAxis(config: C3ChartConfig) {
    super.generateOptionsAxis(config);

    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    // if we have 1 row of data
    if (cmpBiteLogic.values.length <= 2) {
      config.axis.rotated = false;
    }
  }

  protected get dataSorter(): ComparisonChartDataSorter {
    let sorter = this._dataSorter as ComparisonChartDataSorter;
    if (!sorter) {
      sorter = new ComparisonChartDataSorter(this.biteLogic);
      this._dataSorter = sorter;
    }
    return sorter;
  }

}

export interface ComparisonCategValuesElement extends CategValuesElement {
  cmpValue: number|string;
}

export class ComparisonChartDataSorter extends ChartDataSorter {
  protected comparisonValuesLabel: string;

  protected createCategValuesArray() {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    const comparisonValues = this.computeComparisonValues();
    this.comparisonValuesLabel = comparisonValues[0] as string;
    this.categAndValues =
          this.biteLogic.values.slice(1).map( (val, i) => ({
            value: val,
            cmpValue: comparisonValues[i + 1],
            category: this.biteLogic.categories[i]
          }));
  }

  private computeComparisonValues(): (number|string)[] {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    let comparisonValues = cmpBiteLogic.comparisonValues;
    if (cmpBiteLogic.values.length > 2 && cmpBiteLogic.stackChart) {
      comparisonValues = cmpBiteLogic.comparisonValues.map( (val, i) => i > 0 ? val - cmpBiteLogic.values[i] : val);
    }
    return comparisonValues;
  }

  public getSortedComparisonValues() {
    if (this.categAndValues) {
      const comparisonCategAndValues = this.categAndValues as ComparisonCategValuesElement[];
      const cmpValues = comparisonCategAndValues.map(item => item.cmpValue);
      cmpValues.unshift(this.comparisonValuesLabel);
      return cmpValues;
    }

    return this.computeComparisonValues();
  }

  protected sort(): boolean {
    const ascSort = function(a, b) {
      return a.cmpValue - b.cmpValue;
    };
    const descSort = function(a, b) {
      return b.cmpValue - a.cmpValue;
    };
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;

    const reverseByCategory = super.sort();
    if (cmpBiteLogic.sortingByValue2 !== null) {
      if (cmpBiteLogic.sortingByValue2 === ChartBite.SORT_ASC) {
        this.categAndValues.sort(ascSort);
      } else {
        this.categAndValues.sort(descSort);
      }
    }

    return reverseByCategory;
  }
}
