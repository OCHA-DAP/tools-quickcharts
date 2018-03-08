import { ComparisonChartBite, ChartBite } from 'hxl-preview-ng-lib';
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
    const values = [
      this.bite.values,
      (this.bite as ComparisonChartBite).comparisonValues
    ];
    config.tooltip = {
      format: {
        value: (value, ratio, id, index) => {
          let newValue = value;
          if (this.bite.ingredient.aggregateColumn && id === values[1][0]) {
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
    const bite = this.bite as ComparisonChartBite;
    const values = [
      bite.values,
      bite.comparisonValues
    ];
    config.data = {
      columns: values,
      type: 'bar',
    };
    if (this.bite.ingredient.aggregateColumn) {
      config.data.groups = [[
        values[0][0],
        values[1][0]
      ]];
    }
  }

}
