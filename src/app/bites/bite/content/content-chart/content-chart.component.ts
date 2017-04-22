import { Component, OnInit, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChartBite } from '../../types/chart-bite';
import { Input } from '@angular/core';

declare var c3: any;

@Component({
  selector: 'hxl-content-chart',
  templateUrl: './content-chart.component.html',
  styleUrls: ['./content-chart.component.less']
})
export class ContentChartComponent implements OnInit, AfterViewInit {
  @Input()
  bite: ChartBite;

  elementRef: ElementRef;
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

  private generateOptions() {
    return {
      bindto: this.elementRef.nativeElement.children[0],
      data: {
        columns: [this.bite.values],
        type: 'bar'
      },
      zoom: {
        enabled: true,
        type: 'drag', // can be [drag, scroll]
        extent: [1.5, 2]
      },
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
      }
    };
  }

  render(): void {
    const c3_chart = c3.generate(this.generateOptions());
    c3_chart.internal.brush.extent([0, 12]).update();
    c3_chart.internal.redrawForBrush();
  }
}
