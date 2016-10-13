import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {ChartBite} from "../../types/chart-bite";
import {Input} from "@angular/core/src/metadata/directives";

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
    if (this.bite.values){
      let chart = c3.generate({
        bindto: this.elementRef.nativeElement,
        data:{
          columns: [this.bite.values]
        },
        size: {
          height: 185
        }
      });
    }
  }
}
