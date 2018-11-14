import { C3ChartConfig } from './../content-chart/content-chart.component';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ContentChartComponent } from '../content-chart/content-chart.component';
import { TimeseriesChartBiteLogic } from 'hxl-preview-ng-lib';

// declare let c3: any;

@Component({
  selector: 'hxl-content-timeseries-chart',
  templateUrl: './content-timeseries-chart.component.html',
  styleUrls: ['./content-timeseries-chart.component.less']
})
export class ContentTimeseriesChartComponent extends ContentChartComponent implements OnInit, AfterViewInit {

  protected overwriteXAxisLabel() {
    const tsBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    if (tsBiteLogic.dataTitle && tsBiteLogic.values.length === 2) {
      tsBiteLogic.values[1][0] = this.biteLogic.dataTitle;
    }
  }

  protected generateOptionsTooltip(config: C3ChartConfig) {
    super.generateOptionsTooltip(config);
    delete config.tooltip.format.title;
  }

  protected generateOptionsData(config: C3ChartConfig) {
    const tsBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    config.data = {
      x: 'Date',
      columns: tsBiteLogic.values,
      type: 'line'
    };
  }

  protected generateOptionsAxis(config: C3ChartConfig) {
    config.axis = {
      // rotated: true,
      x: {
        type: 'timeseries',
        tick: {
          count: 7,
          rotate: 15,
          format: '%d %b %Y'
          // culling: {
          //   max: 4
          // }
        }
        // categories: this.bite.categories
      },
      y: {
        tick: {
          rotate: 30,
          format: this.numberFormatter
        }
      }
    };
  }

  protected generateOptions(): C3ChartConfig {
    this.overwriteXAxisLabel();
    const config = super.generateOptions();
    const tsBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    config.point = {
      show: (tsBiteLogic.showPoints ? true : false)
    };
    return config;
  }

}
