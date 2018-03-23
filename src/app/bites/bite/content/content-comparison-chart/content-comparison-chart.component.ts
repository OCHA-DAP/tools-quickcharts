import { ChartBite, ComparisonChartBiteLogic } from 'hxl-preview-ng-lib';
import { ContentChartComponent, C3ChartConfig } from './../content-chart/content-chart.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'hxl-content-comparison-chart',
  templateUrl: './content-comparison-chart.component.html',
  styleUrls: ['./content-comparison-chart.component.less']
})
export class ContentComparisonChartComponent extends ContentChartComponent implements OnInit, AfterViewInit {

  ngOnInit() {
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

  protected generateOptionsColor(config: C3ChartConfig) {
    config.color = {
      pattern: ChartBite.colorPattern
    };
  }

  protected generateOptionsData(config: C3ChartConfig) {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    let comparisonValues = cmpBiteLogic.comparisonValues;
    if (cmpBiteLogic.values.length > 2 && cmpBiteLogic.stackChart) {
      comparisonValues = cmpBiteLogic.comparisonValues.map( (val, i) => i > 0 ? val - cmpBiteLogic.values[i] : val);
    }
    const values = [
      cmpBiteLogic.values,
      comparisonValues
    ];
    config.data = {
      columns: values,
      type: 'bar',
    };
    // if we have more than 1 row of data
    if (cmpBiteLogic.values.length > 2 && cmpBiteLogic.stackChart) {
      config.data.groups = [[
        values[0][0],
        values[1][0]
      ]];
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

}
