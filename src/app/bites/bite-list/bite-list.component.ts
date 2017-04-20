import {Component, Input, OnInit} from '@angular/core';
import {Bite} from '../bite/types/bite';
import {SortablejsOptions} from 'angular-sortablejs';
import {BiteService} from '../shared/bite.service';
import {Logger} from 'angular2-logger/core';
import {AppConfigService} from '../../shared/app-config.service';

@Component({
  selector: 'hxl-bite-list',
  templateUrl: './bite-list.component.html',
  styleUrls: ['./bite-list.component.less']
})
export class BiteListComponent implements OnInit {

  biteList: Array<Bite>;
  availableBites: Array<Bite>;
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

  // get displayableAvailableBites(): {displayValue: string, payload: Bite}[] {
  //   return this.availableBites.map( b => {
  //     return {displayValue: b.title, payload: b};
  //   });
  // }

  constructor(private biteService: BiteService, private appConfig: AppConfigService, private logger: Logger) {
    this.biteList = [];
    this.listIsFull = false;
    this.logger = logger;
    this.hxlUnsupported = false;
  }

  ngOnInit() {
    this.logger.info('BiteListComponent on init');
    this.generateAvailableBites();
    this.load();
    if (this.edit) {
      this.onEdit();
    }
  }

  // Deprecated in HXL Preview v2
  // private addLoadedBiteToList(bite: Bite): void {
  //   this.biteList.push(bite);
  //   if (this.biteList.length >= +this.appConfig.get('maxBites')) {
  //     this.listIsFull = true;
  //   }
  // }

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

        this.biteList.push(bite);
        this.logger.log('biteList ' + JSON.stringify(this.biteList));
      },
      errObj => {
        this.logger.log('load>getBites>in ERROR...');
      },
      () => {
        this.logger.log('load>getBites>on COMPLETE...');

        if (this.availableBites && this.biteList && this.availableBites.length !== 0 && this.biteList.length === 0) {
          this.loadDefaultBites();
        }
      }
    );
  }

  // loads 3 bites as default when no other bites are saved
  private loadDefaultBites() {

    // splitting the bites by their type
    const listA = this.availableBites.filter(bite => bite.type === 'chart');
    const listB = this.availableBites.filter(bite => bite.type === 'key figure');
    const listC = this.availableBites.filter(bite => bite.type === 'timeseries');

    let orderedBites: Array<Bite>;
    orderedBites = [];

    if (listA && listA.length > 0) {
      orderedBites.push(listA[0]);
      listA.splice(0, 1);
    }
    if (listB && listB.length > 0) {
      orderedBites.push(listB[0]);
      listB.splice(0, 1);
    }
    if (listC && listC.length > 0) {
      orderedBites.push(listC[0]);
      listC.splice(0, 1);
    }
    orderedBites = orderedBites.concat(listA);
    orderedBites = orderedBites.concat(listB);
    orderedBites = orderedBites.concat(listC);

    // filling the slots
    this.addBite(orderedBites[0]);
    this.addBite(orderedBites[1]);
    this.addBite(orderedBites[2]);

  }

  addBite(bite: Bite) {
    this.biteService.addBite(bite, this.biteList, this.availableBites);
  }

  deleteBite(bite: Bite) {
    this.removeLoadedBiteToList(bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  switchBite(bitePair: { oldBite: Bite, newBite: Bite }) {
    this.biteService.switchBites(bitePair.oldBite, bitePair.newBite, this.biteList, this.availableBites);
  }

  generateAvailableBites() {
    if (!this.availableBites) {
      this.availableBites = [];
      const loadedHashCodeList: number[] = this.biteList ? this.biteList.map(bite => bite.hashCode) : [];
      this.biteService.generateAvailableBites()
        .subscribe(
          bite => {
            this.logger.log('Available bite ' + JSON.stringify(bite));
            if (loadedHashCodeList.indexOf(bite.hashCode) < 0) {
              this.availableBites.push(bite);
            }
          },
          errObj => {
            this.logger.log('in ERROR...');
          },
          () => {
            this.logger.log('on COMPLETE...');
            if (this.availableBites && this.biteList && this.availableBites.length === 0 && this.biteList.length === 0) {
              // Your files contains HXL tags which are not supported by Smart Charts
              this.hxlUnsupported = true;
            }
          }
        );
    }
  }

  // this should be depracated/removed. Functionality copied to this.generateAvailableBites()
  onEdit() {
    if (!this.availableBites) {
      this.availableBites = [];
      const loadedHashCodeList: number[] = this.biteList ? this.biteList.map(bite => bite.hashCode) : [];
      this.biteService.generateAvailableBites()
        .subscribe(
          bite => {
            this.logger.log('Available bite ' + JSON.stringify(bite));
            if (loadedHashCodeList.indexOf(bite.hashCode) < 0) {
              this.availableBites.push(bite);
            }
          },
          errObj => {
            this.logger.log('in ERROR...');
          },
          () => {
            this.logger.log('on COMPLETE...');
            if (this.availableBites && this.biteList && this.availableBites.length === 0 && this.biteList.length === 0) {
              // Your files contains HXL tags which are not supported by Smart Charts
              this.hxlUnsupported = true;
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
