import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';
import { KeyFigureBite } from '../../types/key-figure-bite';

@Component({
  selector: 'hxl-content-topline',
  templateUrl: './content-topline.component.html',
  styleUrls: ['./content-topline.component.less']
})
export class ContentToplineComponent implements OnInit {
  @Input()
  bite: KeyFigureBite;
  @Input()
  edit: boolean;

  constructor() { }

  ngOnInit() {
  }

}
