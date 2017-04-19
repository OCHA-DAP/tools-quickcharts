import { Component, OnInit, EventEmitter } from '@angular/core';
import {Input, Output} from '@angular/core';
import { Bite } from './types/bite';
import { KeyFigureBite } from './types/key-figure-bite';
import { ChartBite } from './types/chart-bite';
import { TimeseriesChartBite } from './types/timeseries-chart-bite';
import { Logger } from 'angular2-logger/core';
import { BiteService } from "app/bites/shared/bite.service";

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
  listIsFull: boolean;

  @Output()
  onAdd = new EventEmitter<Bite>();
  @Output()
  onDelete = new EventEmitter<Bite>();
  @Output()
  onSwitch = new EventEmitter<{oldBite: Bite, newBite: Bite}>();


  classTypes: any = {};
  private settingsDisplay: Boolean = false;
  private uuid: number;

  @Input()
  availableBites: Bite[];

  displayableAvailableBites: {displayValue: string, payload: Bite}[];

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
}
