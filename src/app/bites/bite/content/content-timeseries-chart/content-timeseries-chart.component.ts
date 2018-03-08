import { C3ChartConfig } from './../content-chart/content-chart.component';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ContentChartComponent } from '../content-chart/content-chart.component';

// declare let c3: any;

@Component({
  selector: 'hxl-content-timeseries-chart',
  templateUrl: './content-timeseries-chart.component.html',
  styleUrls: ['./content-timeseries-chart.component.less']
})
export class ContentTimeseriesChartComponent extends ContentChartComponent implements OnInit, AfterViewInit {

  protected overwriteXAxisLabel() {
    if (this.bite.dataTitle && this.bite.values.length === 2) {
      this.bite.values[1][0] = this.bite.dataTitle;
    }
  }

  protected generateOptionsTooltip(config: C3ChartConfig) {
    super.generateOptionsTooltip(config);
    delete config.tooltip.format.title;
  }

  protected generateOptionsData(config: C3ChartConfig) {
    config.data = {
      x: 'Date',
      columns: this.bite.values,
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
    config.point = {
      show: false
    };
    return config;
  }

}
