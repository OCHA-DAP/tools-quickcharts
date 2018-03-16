import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ChartBite, BiteLogicFactory, ColorUsage, UnitsUtil } from 'hxl-preview-ng-lib';
import { Input } from '@angular/core';
import { AnalyticsService } from '../../../shared/analytics.service';

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

  private sortedCategories: string[];

  constructor(elementRef: ElementRef, private analyticsService: AnalyticsService) {
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

  protected numberFormatter(value) {
    const unit = UnitsUtil.computeBiteUnit(value);
    const formattedValue = UnitsUtil.transform(value, null, unit);
    return formattedValue + (unit ? ` ${unit}` : '');
    // const formatter = d3.format('.2s');
    // let string = formatter(value);
    // string = string.replace('G', 'B'); // Billions at more than 6 digits :)
    // if (string.endsWith('.0')) {
    //   string = string.replace('.0', '');
    // }
    // return string;
  }

  // protected tooltipFormatter(d, defaultTitleFormat, defaultValueFormat, color) {
  //   const dX = d[0].x;
  //   let name;
  //   if (isNaN(dX) || dX instanceof Date) {
  //     name = defaultTitleFormat(dX);
  //   } else {
  //     name = this.bite.categories[dX];
  //   }
  //   const value = defaultValueFormat(d[0].value);
  //   const tooltip = '' +
  //     '<div class="c3-hxl-bites-tooltip">' +
  //     ' <span class="name">' + name + '</span>' + ' <span class="value">' + value + '</span>' +
  //     '</div>';

  //   return tooltip;
  // }

  protected generateOptionsTooltip(config: C3ChartConfig) {
    config.tooltip = {
      format: {
        title: function (x) { return this.bite.categories[x]; }.bind(this),
        value: (value, ratio, id, index) => {
          return this.numberFormatter(value);
        }
      },
      // contents: this.tooltipFormatter.bind(this)
    };
  }

  protected generateOptionsColor(config: C3ChartConfig) {
    let pattern = ChartBite.colorPattern;

    // added check for this.bite.color since saved bites might not have any
    if (BiteLogicFactory.createBiteLogic(this.bite).colorUsage() === ColorUsage.ONE && this.bite.color) {
      pattern = [this.bite.color];
    }
    config.color = {
      pattern: pattern
    };
  }

  protected generateOptionsData(config: C3ChartConfig) {
    // const values = this.bite.values.slice(); // copy values
    let values = this.bite.values;
    const ascSort = function(a, b){
      return a.value - b.value;
    };
    const descSort = function(a, b){
      return b.value - a.value;
    };
    if (this.bite.sorting !== null) {
      const valuesLabel = this.bite.values[0];
      const valAndCategArray = this.bite.values.slice(1).map( (val, i) => ({value: val, category: this.bite.categories[i]}));
      if (this.bite.sorting === ChartBite.SORT_ASC) {
        valAndCategArray.sort(ascSort);
      } else {
        valAndCategArray.sort(descSort);
      }
      values = valAndCategArray.map(item => item.value);
      values.unshift(valuesLabel);
      this.sortedCategories = valAndCategArray.map(item => item.category);
    } else {
      this.sortedCategories = null;
    }

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
      // console.log(pieValues);

      config.data = {
        columns: pieValues,
        type: 'pie'
      };
    }
  }

  protected generateOptionsAxis(config: C3ChartConfig) {
    // this.sortedCategories can be set when sorting is selected, otherwise use bite categories
    const categories = this.sortedCategories || this.bite.categories;
    config.axis = {
      rotated: this.bite.swapAxis,
      x: {
        type: 'category',
        categories: this.bite.categories,
        tick: {
        },
        height: 50
      },
      y: {
        tick: {
          rotate: 30,
          format: this.numberFormatter
        }
      }
    };
    if (this.bite.pieChart) {
      config.axis.rotated = false;
    }
    const trimXValues = function (x) {
      const maxLength = 15;
      const value = categories[x];
      if (value && value.length > maxLength) {
        return value.substring(0, maxLength - 3) + '...';
      } else {
        return value;
      }
    };
    if (!this.bite.swapAxis) {
      config.axis.x.tick = {
        rotate: 20,
        width: 100,
        format: trimXValues
      };
    } else {
      config.axis.x.tick = {
        format: trimXValues
      };
    }
  }

  protected generateOptions(): C3ChartConfig {
    this.overwriteXAxisLabel();

    const values = this.bite.values; // copy values

    const config = {
      bindto: this.elementRef.nativeElement.children[0],
      data: {},
      zoom: {},
      size: {
        height: 225
      },
      grid: {
        y: {
          show: this.bite.showGrid
        }
      },
      pie: {},
    };

    this.generateOptionsTooltip(config);
    this.generateOptionsColor(config);
    this.generateOptionsData(config);

    // generateOptionsData() might sort the x axis categories so generateOptionsAxis() needs to come after
    this.generateOptionsAxis(config);

    // if (this.bite.pieChart) {
    //   config.axis.rotated = false; // we don't allow it for pie
      // config.tooltip.format.value = function (value, ratio, id) {
      //   const valueFormat = d3.format(',');
      //   const percentageFormat = d3.format('.1%');
      //   return valueFormat(value) + ' (' + percentageFormat(ratio) + ')';
      // };
    // }

    if (values.length > this.maxNumberOfValues) {
      config.zoom = {
        enabled: false,
        type: 'drag', // can be [drag, scroll]
        extent: [1.5, 2]
      };
    }
    return config;
  }

  render(): void {
    const c3_chart = c3.generate(this.generateOptions());
    // Reasonable defaults
    const PIXEL_STEP  = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;

    function normalizeWheel(/*object*/ event) /*object*/ {
      let sX = 0, sY = 0,       // spinX, spinY
        pX = 0, pY = 0;       // pixelX, pixelY

      // Legacy
      if ('detail'      in event) { sY = event.detail; }
      if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
      if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
      if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

      // side scrolling on FF with DOMMouseScroll
      if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
        sX = sY;
        sY = 0;
      }

      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;

      if ('deltaY' in event) { pY = event.deltaY; }
      if ('deltaX' in event) { pX = event.deltaX; }

      if ((pX || pY) && event.deltaMode) {
        if (event.deltaMode === 1) {          // delta in LINE units
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {                             // delta in PAGE units
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }

      // Fall-back if spin cannot be determined
      if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
      if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

      return { spinX  : sX,
        spinY  : sY,
        pixelX : pX,
        pixelY : pY };
    }

    const zoomHandler = function() {
      const event = d3.event;
      event.preventDefault();
      event.stopPropagation();
      const eventDelta = normalizeWheel(event);

      const delta = -1 * (this.bite.swapAxis ? eventDelta.pixelY : eventDelta.pixelX);

      if (!c3_chart.internal.brush.leftMargin) {
        c3_chart.internal.brush.leftMargin = 0;
        c3_chart.internal.brush.leftMarginRedraw = 0;
      }
      // c3_chart.internal.brush.extent([0, this.maxNumberOfValues]).update();
      let leftMargin = c3_chart.internal.brush.leftMargin;
      leftMargin = leftMargin - delta / 10;
      if (leftMargin < 0) {
        leftMargin = 0;
      }
      if (leftMargin + this.maxNumberOfValues > this.bite.values.length) {
        leftMargin = this.bite.values.length - this.maxNumberOfValues;
      }
      c3_chart.internal.brush.leftMargin = leftMargin;
      c3_chart.internal.brush.extent([leftMargin, leftMargin + this.maxNumberOfValues]);
      let dif = c3_chart.internal.brush.leftMarginRedraw - c3_chart.internal.brush.leftMargin;
      if (dif < 0) {
        dif *= -1;
      }
      if (dif > 0.1) {
        c3_chart.internal.redrawForBrush();
        c3_chart.internal.brush.leftMarginRedraw = c3_chart.internal.brush.leftMargin;
        this.analyticsService.trackChartScroll(this.bite);
        // console.log('Redraw for delta: ' + delta / 10);
      } else {
        // console.log('Skipped redraw');
      }
    };

    d3.select(this.elementRef.nativeElement.children[0]).select('svg')
      .on('wheel.zoom', zoomHandler.bind(this))
      .on('mousewheel.zoom', zoomHandler.bind(this))
      .on('DOMMouseScroll.zoom', zoomHandler.bind(this));
    if (this.bite.values.length > this.maxNumberOfValues) {
      c3_chart.internal.brush.leftMargin = 0;
      c3_chart.internal.brush.extent([0, this.maxNumberOfValues]).update();
      c3_chart.internal.redrawForBrush();
    }

  }
}

// tslint:disable-next-line:interface-over-type-literal
export type C3ChartConfig = { [s: string]: any; };
