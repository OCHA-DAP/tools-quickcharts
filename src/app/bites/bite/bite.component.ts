import { ContentComparisonChartComponent } from './content/content-comparison-chart/content-comparison-chart.component';
import { Component, OnInit, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import {Input, Output} from '@angular/core';
import { Bite, ChartBiteLogic, ComparisonChartBiteLogic } from 'hxl-preview-ng-lib';
import { KeyFigureBite } from 'hxl-preview-ng-lib';
import { ChartBite, ComparisonChartBite } from 'hxl-preview-ng-lib';
import { TimeseriesChartBite } from 'hxl-preview-ng-lib';
import { Logger } from 'angular2-logger/core';
import { BiteService } from 'app/bites/shared/bite.service';
import { ContentChartComponent } from './content/content-chart/content-chart.component';
import { ContentTimeseriesChartComponent } from './content/content-timeseries-chart/content-timeseries-chart.component';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { BiteLogicFactory, ColorUsage, KeyFigureBiteLogic, BiteLogic } from 'hxl-preview-ng-lib';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsService } from '../shared/analytics.service';

@Component({
  selector: 'hxl-bite',
  templateUrl: './bite.component.html',
  styleUrls: ['./bite.component.less']
})

export class BiteComponent implements OnInit {

  @Input()
  bite: Bite;
  @Input()
  index: number;
  @Input()
  singleBite: boolean;
  @Input()
  toolsMode: boolean;
  @Input()
  listIsFull: boolean;
  @Input()
  availableBites: Bite[];

  @Output()
  onAdd = new EventEmitter<Bite>();
  @Output()
  onDelete = new EventEmitter<Bite>();
  @Output()
  onSwitch = new EventEmitter<{oldBite: Bite, newBite: Bite}>();

  @Output()
  onEmbedUrlCreate = new EventEmitter<string>();

  @ViewChild('customColorInput')
  private customColorInput: ElementRef;


  @ViewChild(ContentChartComponent)
  private chartComponent: ContentChartComponent;

  @ViewChild(ContentComparisonChartComponent)
  private comparisonChartComponent: ContentComparisonChartComponent;

  @ViewChild(ContentTimeseriesChartComponent)
  private timeseriesComponent: ContentTimeseriesChartComponent;

  classTypes: any = {};
  settingsDisplay: Boolean = false;
  protected uuid: number;
  poweredByDisplay: Boolean = false;
  protected poweredBySource: String;
  protected poweredByUrl: String;
  protected poweredByDate: String;

  showColorPatternChooser: Boolean = false;
  displayCustomColor: Boolean = false;

  displayableAvailableBites: SimpleDropdownItem[];

  biteLogic: BiteLogic;
  settingsModel: SettingsModel;
  private colorPattern: string[] = ChartBite.colorPattern;
  private SORT_DESC: string = ChartBite.SORT_DESC;

  constructor(private logger: Logger, private biteService: BiteService, private sanitizer: DomSanitizer,
              private analyticsService: AnalyticsService) {
    this.classTypes.ToplineBite = KeyFigureBite.type();
    this.classTypes.ChartBite = ChartBite.type();
    this.classTypes.ComparisonChartBite = ComparisonChartBite.type();
    this.classTypes.TimeseriesChartBite = TimeseriesChartBite.type();
    this.uuid = biteService.getNextId();
    this.poweredByDisplay = biteService.getPoweredByDisplay();
    this.poweredBySource = biteService.getPoweredBySource();
    this.poweredByUrl = biteService.getPoweredByUrl();
    this.poweredByDate = biteService.getPoweredByDate();
  }

  ngOnInit() {
    this.displayableAvailableBites = this.biteService.generateBiteSelectionMenu(this.availableBites);
    this.biteLogic = BiteLogicFactory.createBiteLogic(this.bite);
    this.settingsModel = new SettingsModel(this.biteLogic, this.biteService, this);
    this.showColorPatternChooser = this.biteLogic.colorUsage() === ColorUsage.ONE;
  }

  switchBite(newBite: Bite) {
    this.analyticsService.trackSwitchBite(this.bite, newBite);
    this.onSwitch.emit({oldBite: this.bite, newBite: newBite});
  }

  toggleSettings(self) {
    this.settingsDisplay = !this.settingsDisplay;
    if (this.settingsDisplay) {
      this.analyticsService.trackSettingsMenuOpen(this.bite);
    }
  }

  showCustomColorSection() {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    if (this.colorPattern.indexOf(chartBiteLogic.color) >= 0) {
      chartBiteLogic.uiProperties.color = '#ffffff';
    }
    this.displayCustomColor = true;
    setTimeout(() => {
      this.customColorInput.nativeElement.focus();
    }, 2);
  }
  toggleSorting() {
    if (this.settingsModel.sorting === null) {
      this.settingsModel.sorting = this.SORT_DESC;
    } else {
      this.settingsModel.sorting = null;
    }
    this.renderContent();
  }

  swapSorting() {
    if (this.settingsModel.sorting === ChartBite.SORT_ASC) {
      this.settingsModel.sorting = ChartBite.SORT_DESC;
    } else {
      this.settingsModel.sorting = ChartBite.SORT_ASC;
    }
    this.renderContent();
  }

  hideCustomColorSection() {
    this.displayCustomColor = false;
    this.renderContent();
  }

  getUUID() {
    return this.uuid;
  }

  renderContent() {
    const component = this.chartComponent || this.timeseriesComponent || this.comparisonChartComponent;
    component.render();
  }

  settingsModelChanged(model) {
    this.logger.log(JSON.stringify(model));
  }

  createEmbedLink() {
    const embedUrl = this.biteService.exportBitesToURL([this.bite], true);
    this.onEmbedUrlCreate.emit(embedUrl);
    this.analyticsService.trackEmbed();
  }

  saveAsImage() {
    this.biteService.saveAsImage([this.bite], true);
    this.analyticsService.trackSaveImage();
  }

  asChartBite(bite: Bite): ChartBite {
    return <ChartBite>bite;
  }
}

class SettingsModel {
  bite: Bite;

  private maxDescriptionLength = 200;
  public descriptionRemaining: number;
  private descriptionStr: string;
  // noinspection TsLint

  private changeHandler: ProxyHandler<Bite> = {
    set: function (target: Bite, p: PropertyKey, value: any, receiver: any): boolean {
      this.biteComponent.analyticsService.trackSettingsChanged(target);
      // The default behavior to store the value
      target[p] = value;
      return true;
    }.bind(this)
  };

  constructor(private biteLogic: BiteLogic, private biteService: BiteService, private biteComponent: BiteComponent) {
    this.bite = new Proxy<Bite>(biteLogic.getBite(), this.changeHandler);
    this.computeDescriptionLength();
    this.descriptionStr = this.biteLogic.description;
  }


  get title(): string {
    return this.biteLogic.title;
  }
  set title(title: string) {
    this.bite.uiProperties.title = title;
  }

  get description(): string {
    return this.descriptionStr;
  }
  set description(description: string) {
    if (description.length <= this.maxDescriptionLength) {
      this.bite.uiProperties.description = description;
      this.computeDescriptionLength();
    } else {
      this.descriptionStr = this.biteLogic.description;
    }
  }

  get xAxisLabel(): string {
    return this.biteLogic.dataTitle;
  }

  set xAxisLabel(label: string) {
    this.bite.uiProperties.dataTitle = label;
    this.biteComponent.renderContent();
  }

  get swapAxis(): boolean {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.swapAxis;
  }
  set swapAxis(value: boolean) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.uiProperties.swapAxis = value;
  }

  get showGrid(): boolean {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.showGrid;
  }

  set showGrid(value: boolean) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.uiProperties.showGrid = value;
  }

  // get filterZero(): boolean {
  //   return this.bite.filteredValues.indexOf(0) >= 0;
  // }
  // set filterZero(shouldAdd: boolean) {
  //   if (shouldAdd && this.bite.filteredValues.indexOf(0) < 0) {
  //     this.bite.filteredValues.push(0);
  //     this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
  //   }
  //   if (!shouldAdd) {
  //     const index = this.bite.filteredValues.indexOf(0);
  //     if (index >= 0) {
  //       this.bite.filteredValues.splice(index, 1);
  //       this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
  //     }
  //   }
  // }

  // get filterCustomValue(): number {
  //   for (let i = 0; i < this.bite.filteredValues.length; i++) {
  //     const value = this.bite.filteredValues[i];
  //     if (value !== 0) {
  //       return value;
  //     }
  //   }
  //   return null;
  // }
  // set filterCustomValue(value: number) {
  //   const filterZero = this.filterZero;
  //   this.bite.filteredValues = [];
  //   if (filterZero) {
  //     this.bite.filteredValues.push(0);
  //   }
  //   if (value) {
  //     this.bite.filteredValues.push(value);
  //   }
  //   this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
  // }

  get prefix(): string {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    return kfBiteLogic.preText;
  }
  set prefix(prefix: string) {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    kfBiteLogic.uiProperties.preText = prefix;
  }

  get suffix(): string {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    return kfBiteLogic.postText;
  }
  set suffix(suffix: string) {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    kfBiteLogic.uiProperties.postText = suffix;
  }

  get numberFormat(): string {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    return kfBiteLogic.numberFormat;
  }
  set numberFormat(numberFormat: string) {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    kfBiteLogic.uiProperties.numberFormat = numberFormat;
  }

  get abbreviateValues(): boolean {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    if (kfBiteLogic.unit === 'none') {
      return false;
    }
    return !!kfBiteLogic.unit;
  }
  set abbreviateValues(abbreviateValues: boolean) {
    const kfBiteLogic = this.biteLogic as KeyFigureBiteLogic;
    if (abbreviateValues) {
      kfBiteLogic.uiProperties.unit = null;
    } else {
      kfBiteLogic.uiProperties.unit = 'none';
    }
  }

  get customColor(): string {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.color;
  }

  set customColor(color: string) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.uiProperties.color = color;
  }

  get sorting(): string {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.sorting;
  }

  set sorting(sorting: string) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.uiProperties.sorting = sorting;
  }

  get stackChart(): boolean {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    return cmpBiteLogic.stackChart;
  }

  set stackChart(stackChart: boolean) {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    cmpBiteLogic.uiProperties.stackChart = stackChart;
  }

  computeDescriptionLength() {
    const descriptionLength = this.biteLogic.description ? this.biteLogic.description.length : 0;
    this.descriptionRemaining = this.maxDescriptionLength - descriptionLength;
  }
}
