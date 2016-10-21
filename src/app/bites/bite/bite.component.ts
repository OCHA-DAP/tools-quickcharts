import {Component, OnInit, EventEmitter} from '@angular/core';
import {Input, Output} from '@angular/core/src/metadata/directives';
import { Bite } from './types/bite';
import { ToplineBite } from './types/topline-bite';
import { ChartBite } from './types/chart-bite';

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
  @Output()
  onAdd = new EventEmitter<Bite>();
  @Output()
  onDelete = new EventEmitter<Bite>();
  classTypes: any = {};

  constructor() {
    this.classTypes.ToplineBite = ToplineBite.type();
    this.classTypes.ChartBite = ChartBite.type();
  }

  ngOnInit() {
  }

  addBite() {
    this.onAdd.emit(this.bite);
  }

  deleteBite() {
    this.onDelete.emit(this.bite);
  }
}
