import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ChartBite } from '../../types/chart-bite';
import { Input } from '@angular/core';

declare const c3: any;
declare const d3: any;

@Component({
  selector: 'hxl-content-chart',
  templateUrl: './content-chart.component.html',
  styleUrls: ['./content-chart.component.less']
})
export class ContentChartComponent implements OnInit, AfterViewInit {
  @Input()
  bite: ChartBite;

  elementRef: ElementRef;
  maxNumberOfValues = 7;

  pieThreshold = 4;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.bite.values) {
      this.render();
    }
  }

  protected overwriteXAxisLabel() {
    if (this.bite.dataTitle && this.bite.values.length > this.pieThreshold) {
      this.bite.values[0] = this.bite.dataTitle;
    }
  }

  protected generateOptions(): {} {
    this.overwriteXAxisLabel();

    const config = {
      bindto: this.elementRef.nativeElement.children[0],
      data: {},
      zoom: {},
      size: {
        height: 225
      },
      axis: {
        rotated: this.bite.swapAxis,
        x: {
          type: 'category',
          categories: this.bite.categories
        },
        y: {
          tick: {
            rotate: 30
          }
        }
      },
      grid: {
        y: {
          show: this.bite.showGrid
        }
      },
      pie: {},
      tooltip: {}
    };

    const values = this.bite.values;
    console.log(values);

    if (values.length > (this.pieThreshold + 1)) { // first value is a label
      config.data = {
        columns: [values],
        type: 'bar'
      };
    } else {
      const pieValues = [];
      for (let i = 1; i < values.length; i++) {
        pieValues.push([this.bite.categories[i], values[i]]);
      }
      console.log(pieValues);

      config.data = {
        columns: pieValues,
        type: 'pie'
      };
      config.tooltip = {
        format: {
          // title: function (d) { return 'Data ' + d; },
          value: function (value, ratio, id) {
            const valueFormat = d3.format(',');
            const percentageFormat = d3.format('.1%');
            return valueFormat(value) + ' (' + percentageFormat(ratio) + ')';
          }
        }
      };
    }

    if (values.length > this.maxNumberOfValues) {
      config.zoom = {
        enabled: true,
        type: 'drag', // can be [drag, scroll]
        extent: [1.5, 2]
      };
    }

    return config;
  }

  render(): void {
    const c3_chart = c3.generate(this.generateOptions());
    if (this.bite.values.length > this.maxNumberOfValues) {
      c3_chart.internal.brush.extent([0, this.maxNumberOfValues]).update();
      c3_chart.internal.redrawForBrush();
    }

  }
}
