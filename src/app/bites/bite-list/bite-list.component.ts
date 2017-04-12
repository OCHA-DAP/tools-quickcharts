import { Component, Input, OnInit } from '@angular/core';
import {Bite} from '../bite/types/bite';
import {SortablejsOptions} from 'angular-sortablejs';
import {BiteService} from '../shared/bite.service';
import {Logger} from 'angular2-logger/core';
import { AppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'hxl-bite-list',
  templateUrl: './bite-list.component.html',
  styleUrls: ['./bite-list.component.less']
})
export class BiteListComponent implements OnInit {

  biteList: Array<Bite>;
  private availableBites: Array<Bite>;
  @Input()
  edit: boolean;

  listIsFull: boolean;

  hxlUnsupported: boolean;

  sortableMain: SortablejsOptions = {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true
  };

  constructor(private biteService: BiteService, private appConfig: AppConfigService, private logger: Logger) {
    this.biteList = [];
    this.listIsFull = false;
    this.logger = logger;
    this.hxlUnsupported=true;
  }

  ngOnInit() {
    this.logger.info('BiteListComponent on init');
    this.load();
    if (this.edit) {
      this.onEdit();
    }
  }

  private addLoadedBiteToList(bite: Bite): void {
    this.biteList.push(bite);
    if (this.biteList.length >= +this.appConfig.get('maxBites')) {
      this.listIsFull = true;
    }
  }

  private removeLoadedBiteToList(bite: Bite): void {
    this.biteList = this.biteList.filter(b => b !== bite);
    if (this.biteList.length <= +this.appConfig.get('maxBites')) {
      this.listIsFull = false;
    }
  }

  private load() {
    this.biteService.getBites().subscribe(
      (bite: Bite) => {
        this.logger.log('Processing bite ' + JSON.stringify(bite));

        if (this.availableBites) {
          let removeIndex = -1;
          this.availableBites.forEach((availableBite, idx) => {
            if (availableBite.hashCode === bite.hashCode) {
              removeIndex = idx;
            }
          });
          if (removeIndex >= 0) {
            this.availableBites.splice(removeIndex, 1);
          }
        }

        this.addLoadedBiteToList(bite);
      }
    );
  }


  addBite(bite: Bite) {
    this.availableBites = this.availableBites.filter(b => b !== bite);
    this.biteService.initBite(bite)
      .subscribe(
        b => this.addLoadedBiteToList(b),
        err => {
          this.logger.error('Can\'t process bite due to:' + err);
          this.availableBites.push(bite);
        }
      );
  }

  deleteBite(bite: Bite) {
    this.removeLoadedBiteToList(bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  onEdit() {
    if (!this.availableBites) {
      this.availableBites = [];
      let loadedHashCodeList: number[] = this.biteList ? this.biteList.map(bite => bite.hashCode) : [];
      this.biteService.generateAvailableBites()
        .subscribe(
          bite => {
            this.logger.log('Available bite ' + JSON.stringify(bite));
            if (loadedHashCodeList.indexOf(bite.hashCode) < 0 ) {
              this.availableBites.push(bite);
            }
          },
        errObj => {
            this.logger.log('in ERROR...');
        },
          () => {
            this.logger.log('on COMPLETE...');
            if (this.availableBites.length === 0  && this.biteList.length === 0) {
              // Your files contains HXL tags which are not supported by Smart Charts
              this.hxlUnsupported = false;
            }
        }
        );
    }
  }

  onSave() {
    this.biteService.saveBites(this.biteList);
  }

  onReset() {
    this.logger.log('Reset toggled ... not doing anything for now');
    // this.load();
    this.biteService.resetBites();

  }
}
