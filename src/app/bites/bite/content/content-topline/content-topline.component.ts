import { Component, OnInit } from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {ToplineBite} from "../../types/topline-bite";

@Component({
  selector: 'hxl-content-topline',
  templateUrl: './content-topline.component.html',
  styleUrls: ['./content-topline.component.less']
})
export class ContentToplineComponent implements OnInit {
  @Input()
  bite: ToplineBite;
  @Input()
  edit: boolean;

  constructor() { }

  ngOnInit() {
  }

}
