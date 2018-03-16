import { ContentComparisonChartComponent } from './content/content-comparison-chart/content-comparison-chart.component';
import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {Input, Output} from '@angular/core';
import { Bite } from 'hxl-preview-ng-lib';
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
  private uuid: number;
  poweredByDisplay: Boolean = false;
  private poweredBySource: String;
  private poweredByUrl: String;
  private poweredByDate: String;

  showColorPatternChooser: Boolean = false;
  displayCustomColor: Boolean = false;

  displayableAvailableBites: SimpleDropdownItem[];

  biteLogic: BiteLogic;
  settingsModel: SettingsModel;
  private colorPattern: string[] = ChartBite.colorPattern;
  private SORT_DESC: string = ChartBite.SORT_DESC;

  constructor(private logger: Logger, private biteService: BiteService, private sanitizer: DomSanitizer) {
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
    this.onSwitch.emit({oldBite: this.bite, newBite: newBite});
  }

  toggleSettings(self) {
    this.settingsDisplay = !this.settingsDisplay;
  }

  showCustomColorSection() {
    const bite: ChartBite = this.bite as ChartBite;
    if (this.colorPattern.indexOf(bite.color) >= 0) {
      bite.color = '#ffffff';
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
  }

  saveAsImage() {
    this.biteService.saveAsImage([this.bite], true);
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

  constructor(private biteLogic: BiteLogic, private biteService: BiteService, private biteComponent: BiteComponent) {
    this.computeDescriptionLength();
    this.descriptionStr = this.biteLogic.description;
    this.bite = biteLogic.getBite();
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
    return this.bite.dataTitle;
  }

  set xAxisLabel(label: string) {
    this.bite.dataTitle = label;
    this.biteComponent.renderContent();
  }

  get swapAxis(): boolean {
    return (<ChartBite>this.bite).swapAxis;
  }
  set swapAxis(value: boolean) {
    const chartBite: ChartBite = <ChartBite>this.bite;
    chartBite.swapAxis = value;
  }

  get showGrid(): boolean {
    return (<ChartBite>this.bite).showGrid;
  }

  set showGrid(value: boolean) {
    const chartBite: ChartBite = <ChartBite>this.bite;
    chartBite.showGrid = value;
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
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    return keyFigureBite.preText;
  }
  set prefix(prefix: string) {
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    keyFigureBite.preText = prefix;
  }

  get suffix(): string {
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    return keyFigureBite.postText;
  }
  set suffix(suffix: string) {
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    keyFigureBite.postText = suffix;
  }

  get numberFormat(): string {
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    return keyFigureBite.numberFormat;
  }
  set numberFormat(numberFormat: string) {
    const keyFigureBite: KeyFigureBite = this.bite as KeyFigureBite;
    keyFigureBite.numberFormat = numberFormat;
  }

  get abbreviateValues(): boolean {
    const bite: KeyFigureBite = this.bite as KeyFigureBite;
    if (bite.unit === 'none') {
      return false;
    }
    return !!bite.unit;
  }
  set abbreviateValues(abbreviateValues: boolean) {
    const bite: KeyFigureBite = this.bite as KeyFigureBite;
    if (abbreviateValues) {
      const biteLogic: KeyFigureBiteLogic = BiteLogicFactory.createBiteLogic(bite) as KeyFigureBiteLogic;
      biteLogic.computeBiteUnit(true);
    } else {
      bite.unit = 'none';
    }
  }

  get customColor(): string {
    const bite: ChartBite = this.bite as ChartBite;
    return bite.color;
  }

  set customColor(color: string) {
    const bite: ChartBite = this.bite as ChartBite;
    bite.color = color;
  }

  get sorting(): string {
    const bite: ChartBite = this.bite as ChartBite;
    return bite.sorting;
  }

  set sorting(sorting: string) {
    const bite: ChartBite = this.bite as ChartBite;
    bite.sorting = sorting;
  }

  computeDescriptionLength() {
    const descriptionLength = this.biteLogic.description ? this.biteLogic.description.length : 0;
    this.descriptionRemaining = this.maxDescriptionLength - descriptionLength;
  }
}
