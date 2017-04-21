import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import {Input, Output} from '@angular/core';
import { Bite } from './types/bite';
import { KeyFigureBite } from './types/key-figure-bite';
import { ChartBite } from './types/chart-bite';
import { TimeseriesChartBite } from './types/timeseries-chart-bite';
import { Logger } from 'angular2-logger/core';
import { BiteService } from 'app/bites/shared/bite.service';
import { ContentChartComponent } from './content/content-chart/content-chart.component';

@Component({
  selector: 'hxl-bite',
  templateUrl: './bite.component.html',
  styleUrls: ['./bite.component.less']
})

export class BiteComponent implements OnInit {

  @Input()
  bite: Bite;
  @Input()
  add: boolean;
  @Input()
  edit: boolean;
  @Input()
  index: number;
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

  @ViewChild(ContentChartComponent)
  private chartComponent: ContentChartComponent;

  classTypes: any = {};
  private settingsDisplay: Boolean = false;
  private uuid: number;

  displayableAvailableBites: {displayValue: string, payload: Bite}[];

  settingsModel: SettingsModel;

  constructor(private logger: Logger, biteService: BiteService) {
    this.classTypes.ToplineBite = KeyFigureBite.type();
    this.classTypes.ChartBite = ChartBite.type();
    this.classTypes.TimeseriesChartBite = TimeseriesChartBite.type();
    this.uuid = biteService.getNextId();

  }

  ngOnInit() {
    if (this.availableBites) {
      this.displayableAvailableBites = this.availableBites.map(bite => {
        return {displayValue: bite.title, payload: bite};
      });
    }
    this.settingsModel = new SettingsModel(this.bite);
  }

  addBite() {
    this.onAdd.emit(this.bite);
  }

  deleteBite() {
    this.onDelete.emit(this.bite);
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
    this.chartComponent.render();
  }

  settingsModelChanged(model) {
    this.logger.log(JSON.stringify(model));
  }
}

class SettingsModel {
  private maxDescriptionLength = 20;
  public descriptionRemaining: number;
  private descriptionStr: string;

  constructor(private bite: Bite) {
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

  computeDescriptionLength() {
    const descriptionLength = this.bite.description ? this.bite.description.length : 0;
    this.descriptionRemaining = this.maxDescriptionLength - descriptionLength;
  }
}
