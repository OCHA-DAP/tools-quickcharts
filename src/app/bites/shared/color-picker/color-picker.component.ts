import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Bite, ChartBiteLogic } from 'hxl-preview-ng-lib';

@Component({
  selector: 'hxl-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent implements OnInit {

  @Input()
  colorPattern: string[];

  @Input()
  selectedColor: string;

  @Output()
  onChange = new EventEmitter<string>();

  temporaryCustomColor: string;
  displayCustomColor = false;

  @ViewChild('customColorInput')
  private customColorInput: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  showCustomColorSection() {
    if (this.colorPattern.indexOf(this.selectedColor) >= 0) {
      this.temporaryCustomColor = this.selectedColor;
    }
    this.displayCustomColor = true;

    setTimeout(() => {
      this.customColorInput.nativeElement.focus();
    }, 2);
  }

  hideCustomColorSection() {
    this.displayCustomColor = false;
    this.onChange.emit(this.temporaryCustomColor);
  }

  

}
