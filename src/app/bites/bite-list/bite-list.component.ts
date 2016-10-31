import { Component, Input, OnInit } from '@angular/core';
import {Bite} from '../bite/types/bite';
import {SortablejsOptions} from 'angular-sortablejs';
import {BiteService} from '../shared/bite.service';
import {Logger} from 'angular2-logger/core';

@Component({
  selector: 'hxl-bite-list',
  templateUrl: './bite-list.component.html',
  styleUrls: ['./bite-list.component.less']
})
export class BiteListComponent implements OnInit {
  private biteList: Array<Bite>;
  private availableBites: Array<Bite>;
  @Input()
  edit: boolean;
  sortableMain: SortablejsOptions = {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost'
  };

  constructor(private biteService: BiteService, private logger: Logger) {
    this.biteList = [];
    this.logger = logger;
  }

  ngOnInit() {
    this.logger.info('BiteListComponent on init');
    this.load();
  }

  private load() {
    this.biteService.getBites()
      .then(bites => this.biteList = bites);
  }


  addBite(bite: Bite) {
    this.availableBites = this.availableBites.filter(b => b !== bite);
    this.biteService.initBite(bite)
      .subscribe(
        b => this.biteList.push(b),
        err => {
          this.logger.error('Can\'t process bite due to:' + err);
          this.availableBites.push(bite);
        }
      );
  }

  deleteBite(bite: Bite) {
    this.biteList = this.biteList.filter(b => b !== bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  onEdit() {
    if (!this.availableBites) {
      this.availableBites = [];
      this.biteService.generateAvailableBites()
        .subscribe(
          bite => this.availableBites.push(bite)
        );
    }
  }

  onSave() {
    this.biteService.saveBites(this.biteList);
    // TODO: remove when generating the available bites
    this.biteService.tempPersistAvailable(this.availableBites);
  }

  onReset() {
    this.logger.log('Reset toggled ... not doing anything for now');
    // this.load();
  }
}