import { Component, OnInit } from '@angular/core';
import {BiteService} from "./shared/bite.service";
import {Bite} from "./bite/types/bite";

@Component({
  selector: 'hxl-bites',
  templateUrl: './bites.component.html',
  styleUrls: ['./bites.component.less']
})
export class BitesComponent implements OnInit {
  private biteList: Bite[];
  private editMode: boolean;

  constructor() {
    this.editMode = false;
  }

  ngOnInit() {
  }

}
