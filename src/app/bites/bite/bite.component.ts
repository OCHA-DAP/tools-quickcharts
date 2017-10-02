import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import {Input, Output} from '@angular/core';
import { Bite } from 'hdxtools-ng-lib';
import { KeyFigureBite } from 'hdxtools-ng-lib';
import { ChartBite } from 'hdxtools-ng-lib';
import { TimeseriesChartBite } from 'hdxtools-ng-lib';
import { Logger } from 'angular2-logger/core';
import { BiteService } from 'app/bites/shared/bite.service';
import { ContentChartComponent } from './content/content-chart/content-chart.component';
import { ContentTimeseriesChartComponent } from './content/content-timeseries-chart/content-timeseries-chart.component';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { BiteLogicFactory } from 'hdxtools-ng-lib';
import { KeyFigureBiteLogic } from 'hdxtools-ng-lib';

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

  @ViewChild(ContentChartComponent)
  private chartComponent: ContentChartComponent;

  @ViewChild(ContentTimeseriesChartComponent)
  private timeseriesComponent: ContentTimeseriesChartComponent;

  classTypes: any = {};
  private settingsDisplay: Boolean = false;
  private uuid: number;
  private poweredByDisplay: Boolean = false;
  private poweredBySource: String;
  private poweredByUrl: String;
  private poweredByDate: String;

  displayableAvailableBites: SimpleDropdownItem[];

  settingsModel: SettingsModel;

  constructor(private logger: Logger, private biteService: BiteService) {
    this.classTypes.ToplineBite = KeyFigureBite.type();
    this.classTypes.ChartBite = ChartBite.type();
    this.classTypes.TimeseriesChartBite = TimeseriesChartBite.type();
    this.uuid = biteService.getNextId();
    this.poweredByDisplay = biteService.getPoweredByDisplay();
    this.poweredBySource = biteService.getPoweredBySource();
    this.poweredByUrl = biteService.getPoweredByUrl();
    this.poweredByDate = biteService.getPoweredByDate();
  }

  ngOnInit() {
    this.displayableAvailableBites = this.biteService.generateBiteSelectionMenu(this.availableBites);
    this.settingsModel = new SettingsModel(this.bite, this.biteService, this);
  }

  switchBite(newBite: Bite) {
    this.onSwitch.emit({oldBite: this.bite, newBite: newBite});
  }

  toggleSettings(self) {
    this.settingsDisplay = !this.settingsDisplay;
  }

  getUUID() {
    return this.uuid;
  }

  renderContent() {
    if (this.chartComponent) {
      this.chartComponent.render();
    } else if (this.timeseriesComponent) {
      this.timeseriesComponent.render();
    }
  }

  settingsModelChanged(model) {
    this.logger.log(JSON.stringify(model));
  }

  createEmbedLink() {
    const embedUrl = this.biteService.exportBitesToURL([this.bite], true);
    this.onEmbedUrlCreate.emit(embedUrl);
  }
}

class SettingsModel {
  private maxDescriptionLength = 200;
  public descriptionRemaining: number;
  private descriptionStr: string;

  constructor(private bite: Bite, private biteService: BiteService, private biteComponent: BiteComponent) {
    this.computeDescriptionLength();
    this.descriptionStr = this.bite.description;
  }
  get title(): string {
    return this.bite.title;
  }
  set title(title: string) {
    this.bite.title = title;
  }

  get description(): string {
    return this.descriptionStr;
  }
  set description(description: string) {
    if (description.length <= this.maxDescriptionLength) {
      this.bite.description = description;
      this.computeDescriptionLength();
    } else {
      this.descriptionStr = this.bite.description;
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

  get filterZero(): boolean {
    return this.bite.filteredValues.indexOf(0) >= 0;
  }
  set filterZero(shouldAdd: boolean) {
    if (shouldAdd && this.bite.filteredValues.indexOf(0) < 0) {
      this.bite.filteredValues.push(0);
      this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
    }
    if (!shouldAdd) {
      const index = this.bite.filteredValues.indexOf(0);
      if (index >= 0) {
        this.bite.filteredValues.splice(index, 1);
        this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
      }
    }
  }

  get filterCustomValue(): number {
    for (let i = 0; i < this.bite.filteredValues.length; i++) {
      const value = this.bite.filteredValues[i];
      if (value !== 0) {
        return value;
      }
    }
    return null;
  }
  set filterCustomValue(value: number) {
    const filterZero = this.filterZero;
    this.bite.filteredValues = [];
    if (filterZero) {
      this.bite.filteredValues.push(0);
    }
    if (value) {
      this.bite.filteredValues.push(value);
    }
    this.biteService.initBite(this.bite).subscribe(bite => this.biteComponent.renderContent());
  }

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

  computeDescriptionLength() {
    const descriptionLength = this.bite.description ? this.bite.description.length : 0;
    this.descriptionRemaining = this.maxDescriptionLength - descriptionLength;
  }
}
