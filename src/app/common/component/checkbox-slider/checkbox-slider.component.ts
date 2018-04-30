import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'hxl-checkbox-slider',
  templateUrl: './checkbox-slider.component.html',
  styleUrls: ['./checkbox-slider.component.less']
})
export class CheckboxSliderComponent implements OnInit {

  @Output()
  checked: EventEmitter<boolean>;

  @Input()
  uuid = 'default';

  @Input()
  name: string;

  @Input()
  title: string;

  @Input()
  initiallyChecked: boolean;

  @Input()
  forMenu = false;

  constructor() {
    this.checked = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  toggle(checked: boolean) {
    this.checked.emit(checked);
    return true;
  }

}
