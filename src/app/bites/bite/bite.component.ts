import { ContentComparisonChartComponent } from './content/content-comparison-chart/content-comparison-chart.component';
import { Component, OnInit, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import {Input, Output} from '@angular/core';
import {
  Bite,
  BiteLogic,
  BiteLogicFactory,
  ChartBite,
  ChartBiteLogic,
  ChartComputedProperties,
  ChartUIProperties,
  ComparisonChartBite,
  ComparisonChartBiteLogic,
  ComparisonChartUIProperties,
  KeyFigureBite,
  KeyFigureBiteLogic,
  TimeseriesChartBiteLogic,
  TimeseriesChartBite,
  ColorUsage
} from 'hxl-preview-ng-lib';
import { NGXLogger as Logger } from 'ngx-logger';
import { BiteService } from 'app/bites/shared/bite.service';
import { ContentChartComponent } from './content/content-chart/content-chart.component';
import { ContentTimeseriesChartComponent } from './content/content-timeseries-chart/content-timeseries-chart.component';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsService } from '../shared/analytics.service';
import { MAX_LIMIT_VALUE } from 'hxl-preview-ng-lib';

@Component({
  selector: 'hxl-bite',
  templateUrl: './bite.component.html',
  styleUrls: ['./bite.component.less']
})

export class BiteComponent implements OnInit, OnChanges {

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
  hasModifyPermission = false;
  @Input()
  availableBites: Bite[];
  @Input()
  allowShare: boolean;
  @Input()
  allowSettings: boolean;
  @Input()
  externalColorPattern: string[];
  @Input()
  allowCustomColor: true;
  @Input()
  maxNumberOfValues: number;

  @Output()
  onAdd = new EventEmitter<Bite>();
  @Output()
  onDelete = new EventEmitter<Bite>();
  @Output()
  onSwitch = new EventEmitter<{oldBite: Bite, newBite: Bite}>();

  @Output()
  onSave = new EventEmitter<number>();
  @Output()
  onCancel = new EventEmitter<number>();

  @Output()
  onEmbedUrlCreate = new EventEmitter<string>();

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
  temporaryCustomColor: string;
  protected colorPattern: string[] = ChartBite.colorPattern;
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
    this.biteLogic = BiteLogicFactory.createBiteLogic(this.bite);
    this.settingsModel = new SettingsModel(this.biteLogic, this.biteService, this);
    this.showColorPatternChooser = this.biteLogic.colorUsage() !== ColorUsage.NONE;
    this.colorPattern = this.externalColorPattern ? this.externalColorPattern : this.colorPattern;
    this.biteLogic.initColorsIfNeeded(this.colorPattern);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableBites']) {
      this.displayableAvailableBites = this.biteService.generateBiteSelectionMenu(this.availableBites);
    }
  }

  switchBite(newBite: Bite) {
    this.analyticsService.trackSwitchBite(this.bite, newBite);
    this.onSwitch.emit({oldBite: this.bite, newBite: newBite});
  }

  selectedBiteClassRenderer(bite: Bite, selectedBite: Bite) {
    if (selectedBite.hashCode === bite.hashCode) {
      return 'selected';
    }

    return '';
  }

  cancel() {
    this.onCancel.emit(this.index);
    this.toggleSettings(false);
    this.biteLogic.tempShowSaveCancelButtons = false;
  }

  save() {
    this.onSave.emit(this.index);
    this.toggleSettings(false);
    this.biteLogic.tempShowSaveCancelButtons = false;
  }

  toggleSettings(show?: boolean) {
    if (show === true) {
      this.settingsDisplay = true;
    } else if (show === false) {
      this.settingsDisplay = false;
    } else {
      this.settingsDisplay = !this.settingsDisplay;
    }
    if (this.settingsDisplay) {
      this.biteLogic.tempShowSaveCancelButtons = true;
      this.analyticsService.trackSettingsMenuOpen(this.bite);
    }
  }

  toggleSortingForValue1() {
    this.settingsModel.sortingByValue1 = this.settingsModel.sortingByValue1 ? null : this.SORT_DESC;

    this.renderContent();
  }

  swapSortingForValue1() {
    this.settingsModel.sortingByValue1 =
        this.settingsModel.sortingByValue1 === ChartBite.SORT_ASC ? ChartBite.SORT_DESC : ChartBite.SORT_ASC;

    this.renderContent();
  }

  toggleSortingForValue2() {
    this.settingsModel.sortingByValue2 = this.settingsModel.sortingByValue2 ? null : this.SORT_DESC;

    this.renderContent();
  }

  swapSortingForValue2() {
    this.settingsModel.sortingByValue2 =
        this.settingsModel.sortingByValue2 === ChartBite.SORT_ASC ? ChartBite.SORT_DESC : ChartBite.SORT_ASC;

    this.renderContent();
  }

  toggleSortingForCategory1() {
    this.settingsModel.sortingByCategory1 = this.settingsModel.sortingByCategory1 ? null : this.SORT_DESC;

    this.renderContent();
  }

  swapSortingForCategory1() {
    this.settingsModel.sortingByCategory1 =
        this.settingsModel.sortingByCategory1 === ChartBite.SORT_ASC ? ChartBite.SORT_DESC : ChartBite.SORT_ASC;

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
    const embedUrl = this.biteService.exportBitesToURL([this.bite], null, null, true);
    this.onEmbedUrlCreate.emit(embedUrl);
    this.analyticsService.trackEmbed(embedUrl, true);
  }

  saveAsImage() {
    this.biteService.saveAsImage([this.bite], null, null, true);
    this.analyticsService.trackSaveImage(true);
  }

  asChartBite(bite: Bite): ChartBite {
    return <ChartBite>bite;
  }

  isPieChart(bite: Bite): boolean {
    const chartBite: ChartBite = <ChartBite>bite;
    const computedProperties: ChartComputedProperties = <ChartComputedProperties>chartBite.computedProperties;
    return computedProperties.pieChart;
  }

  selectCustomColor(color: string) {
    this.settingsModel.customColor = color;
    this.renderContent();
  }

  selectComparisonCustomColor(color: string) {
    this.settingsModel.comparisonCustomColor = color;
    this.renderContent();
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

  get limit(): number {
    const biteLogic = this.biteLogic as ChartBiteLogic;
    return biteLogic.limit;
  }

  set limit(label: number) {
    const uiProperties = this.bite.uiProperties as ChartUIProperties;
    if (label > MAX_LIMIT_VALUE) {
      label = MAX_LIMIT_VALUE;
    }
    uiProperties.limit = label;
    this.biteComponent.renderContent();
  }

  get xAxisLabel2(): string {
    const biteLogic: ComparisonChartBiteLogic = (<ComparisonChartBiteLogic>this.biteLogic);
    return biteLogic.comparisonDataTitle;
  }

  set xAxisLabel2(label: string) {
    const uiProperties: ComparisonChartUIProperties = (<ComparisonChartUIProperties>this.bite.uiProperties);
    uiProperties.comparisonDataTitle = label;
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

  get showPoints(): boolean {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    return timeseriesChartBiteLogic.showPoints;
  }

  set showPoints(value: boolean) {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    timeseriesChartBiteLogic.uiProperties.showPoints = value;
  }

  get showAllDates(): boolean {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    return timeseriesChartBiteLogic.showAllDates;
  }

  set showAllDates(value: boolean) {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    timeseriesChartBiteLogic.uiProperties.showAllDates = value;
  }

  get dateFormat(): string {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    return timeseriesChartBiteLogic.dateFormat;
  }

  set dateFormat(value: string) {
    const timeseriesChartBiteLogic = this.biteLogic as TimeseriesChartBiteLogic;
    timeseriesChartBiteLogic.uiProperties.dateFormat = value;
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

  private colorTest(color): boolean {
    const WHITE = '#ffffff';
    return (color !== WHITE && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
  }

  get customColor(): string {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.color;
  }

  set customColor(color: string) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    if (this.colorTest(color)) {
      chartBiteLogic.uiProperties.color = color;
    } else {
      chartBiteLogic.uiProperties.color = ChartBite.colorPattern[0];
    }
  }

  get comparisonCustomColor(): string {
    const chartBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    return chartBiteLogic.comparisonColor;
  }

  set comparisonCustomColor(color: string) {
    const chartBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    if (this.colorTest(color)) {
      chartBiteLogic.uiProperties.comparisonColor = color;
    } else {
      chartBiteLogic.uiProperties.comparisonColor = ChartBite.colorPattern[0];
    }
  }

  get sortingByValue1(): string {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.sortingByValue1;
  }

  set sortingByValue1(sortingByValue1: string) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.sortingByValue1 = sortingByValue1;
  }

  get sortingByValue2(): string {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    return cmpBiteLogic.sortingByValue2;
  }

  set sortingByValue2(sortingByValue2: string) {
    const cmpBiteLogic = this.biteLogic as ComparisonChartBiteLogic;
    cmpBiteLogic.sortingByValue2 = sortingByValue2;
  }

  get sortingByCategory1(): string {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    return chartBiteLogic.sortingByCategory1;
  }

  set sortingByCategory1(sortingByCategory1: string) {
    const chartBiteLogic = this.biteLogic as ChartBiteLogic;
    chartBiteLogic.sortingByCategory1 = sortingByCategory1;
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
