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
      c3.generate(this.generateOptions());
    }
  }

  private generateOptions() {
    return {
      bindto: this.elementRef.nativeElement.children[0],
      data: {
        columns: [this.bite.values],
        type: 'bar'
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
    c3.generate(this.generateOptions());
  }
}
