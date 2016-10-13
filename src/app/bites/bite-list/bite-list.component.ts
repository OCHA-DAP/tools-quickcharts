import { Component, Input, OnInit } from '@angular/core';
import {Bite} from "../bite/types/bite";
import {SortablejsOptions} from "angular-sortablejs";
import {BiteService} from "../shared/bite.service";
import {Logger} from "angular2-logger/core";

@Component({
  selector: 'hxl-bite-list',
  templateUrl: './bite-list.component.html',
  styleUrls: ['./bite-list.component.less']
})
export class BiteListComponent implements OnInit {
  private biteList: Bite[];
  private availableBites: Bite[];
  @Input()
  edit: boolean;

  private sortableMain: SortablejsOptions = {
    handle: ".drag-handle",
    animation: 150,
    ghostClass: "sortable-ghost"
  };

  constructor(private biteService: BiteService, private logger: Logger) {
    this.biteList = [];
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.biteService.getBites()
      .then(bites => this.biteList = bites);
    this.biteService.generateAvailableBites()
      .then(bites => this.availableBites = bites);
  }


  addBite(bite: Bite){
    this.availableBites = this.availableBites.filter(b => b != bite);
    this.biteService.initBite(bite)
      .then(bite => this.biteList.push(bite));
  }

  deleteBite(bite: Bite){
    this.biteList = this.biteList.filter(b => b != bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  save(){
    this.biteService.saveBites(this.biteList);
    //TODO: remove when generating the available bites
    this.biteService.tempPersistAvailable(this.availableBites);

  }

  reset(){
    this.logger.log("Reset toggled");
    this.load();
  }
}
