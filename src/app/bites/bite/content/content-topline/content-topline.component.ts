import { Component, OnInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { KeyFigureBite, KeyFigureBiteLogic, BiteLogicFactory } from 'hxl-preview-ng-lib';

@Component({
  selector: 'hxl-content-topline',
  templateUrl: './content-topline.component.html',
  styleUrls: ['./content-topline.component.less']
})
export class ContentToplineComponent implements OnInit, OnChanges {
  @Input()
  bite: KeyFigureBite;

  biteLogic: KeyFigureBiteLogic;

  constructor() { }

  ngOnChanges() {
    if (!this.biteLogic) {
      this.biteLogic = BiteLogicFactory.createBiteLogic(this.bite) as KeyFigureBiteLogic;
    }
  }

  ngOnInit() {
  }

}
