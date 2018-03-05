import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { KeyFigureBite } from 'hxl-preview-ng-lib';

@Component({
  selector: 'hxl-content-topline',
  templateUrl: './content-topline.component.html',
  styleUrls: ['./content-topline.component.less']
})
export class ContentToplineComponent implements OnInit {
  @Input()
  bite: KeyFigureBite;

  constructor() { }

  ngOnInit() {
  }

}
