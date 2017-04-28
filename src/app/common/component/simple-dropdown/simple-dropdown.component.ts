import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Logger } from 'angular2-logger/core';

export interface SimpleDropdownItem {
  displayValue: string;
  type: string; // header, menuitem, divider
  payload: any;
}

@Component({
  selector: 'simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: ['./simple-dropdown.component.less']
})
export class SimpleDropdownComponent implements OnInit {

  @Output()
  selected: EventEmitter<any>;

  @Input()
  items: SimpleDropdownItem[];

  @Input()
  buttonText: string;

  @Input()
  glyphiconClass: string;

  constructor(private logger: Logger) {
    this.selected = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  itemSelected(payload: any) {
    this.selected.emit(payload);
    return false;
  }

}
