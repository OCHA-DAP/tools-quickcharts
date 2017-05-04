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
  maxNumberOfValues = 7.5;

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
    if (this.bite.dataTitle && !this.bite.pieChart) {
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
          categories: this.bite.categories,
          tick: {},
          height: 50
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
      tooltip: {
        format: {
          title: function (x) { return this.bite.categories[x]; }.bind(this),
          value: undefined
        }
      },
      color: {
        pattern: ['#1ebfb3', '#0077ce', '#f2645a', '#9C27B0']
      }
    };

    const values = this.bite.values;
    const categories = this.bite.categories;

    if (!this.bite.pieChart) {
      config.data = {
        columns: [values],
        type: 'bar'
      };
    } else {
      const pieValues = [];
      for (let i = 1; i < values.length; i++) {
        pieValues.push([this.bite.categories[i - 1], values[i]]);
      }
      console.log(pieValues);

      config.data = {
        columns: pieValues,
        type: 'pie'
      };
      config.axis.rotated = false; // we don't allow it for pie
      config.tooltip.format.value = function (value, ratio, id) {
        const valueFormat = d3.format(',');
        const percentageFormat = d3.format('.1%');
        return valueFormat(value) + ' (' + percentageFormat(ratio) + ')';
      };
    }

    if (values.length > this.maxNumberOfValues) {
      config.zoom = {
        enabled: false,
        type: 'drag', // can be [drag, scroll]
        extent: [1.5, 2]
      };
    }

    if (!this.bite.swapAxis) {
      config.axis.x.tick = {
        rotate: 20,
        width: 100,
        format: function (x) {
          const maxLength = 15;
          const value = categories[x];
          if (value.length > maxLength) {
            return value.substring(0, maxLength - 3) + '...';
          } else {
            return value;
          }
        }
      };
    }

    return config;
  }

  render(): void {
    const c3_chart = c3.generate(this.generateOptions());
    d3.select(this.elementRef.nativeElement.children[0]).select('svg')
      .on('wheel.zoom', function() {
        const delta = this.bite.swapAxis ? d3.event.wheelDeltaY : d3.event.wheelDeltaX;
        c3_chart.internal.brush.extent([0, this.maxNumberOfValues]).update();
        let leftMargin = c3_chart.internal.brush.leftMargin;
        leftMargin = leftMargin - delta / 100;
        if (leftMargin < 0) {
          leftMargin = 0;
        }
        if (leftMargin + this.maxNumberOfValues > this.bite.values.length) {
          leftMargin = this.bite.values.length - this.maxNumberOfValues;
        }
        c3_chart.internal.brush.leftMargin = leftMargin;
        c3_chart.internal.brush.extent([leftMargin, leftMargin + this.maxNumberOfValues]);
        c3_chart.internal.redrawForBrush();
      }.bind(this)) ;
    if (this.bite.values.length > this.maxNumberOfValues) {
      c3_chart.internal.brush.leftMargin = 0;
      c3_chart.internal.brush.extent([0, this.maxNumberOfValues]).update();
      c3_chart.internal.redrawForBrush();
    }

  }
}
