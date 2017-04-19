import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { RecipeService } from './recipe.service';
import { Logger } from 'angular2-logger/core';
import { CookBookService } from './cook-book.service';
import { Observable } from 'rxjs';
import { PersistService } from './persist.service';
import { AppConfigService } from '../../shared/app-config.service';
import { BiteLogicFactory } from '../bite/types/bite-logic-factory';
import { DomEventsService } from '../../shared/dom-events.service';

@Injectable()
export class BiteService {
  public url: string;

  private static findBiteInArray(bite: Bite, bites: Bite[]): number {
    let index = -1;
    for (let i = 0; i < bites.length; i++) {
      if (bite === bites[i]) {
        index = i;
      }
    }
    return index;
  }

  constructor(private recipeService: RecipeService, private cookBookService: CookBookService,
              private logger: Logger, private persistService: PersistService,
              private appConfigService: AppConfigService, private domEventService: DomEventsService) { }

  public init(url: string) {
    this.url = url;
  }

  private loadBites(): Observable<Bite[]> {
    let embeddedConfig = this.appConfigService.get('embeddedConfig');
    if (embeddedConfig && embeddedConfig.length) {
      return Observable.of(JSON.parse(embeddedConfig));
    } else {
      return this.persistService.load();
    }
  }

  getBites(): Observable<Bite> {
    return this.loadBites()
      .flatMap(
        (bites: Bite[]) => {
          this.logger.log('Loaded bites are: ' + JSON.stringify(bites));
          return this.recipeService.processAll(bites, this.url);
        }
      );
  }

  saveBites(biteList: Bite[]) {
    let modifiedBiteList = this.unpopulateListOfBites(biteList);
    this.persistService.save(modifiedBiteList)
      .subscribe(
        (successful: boolean) => {
          this.logger.log('Result of bites saved: ' + successful);
          this.domEventService.sendSavedEvent();
        },
        error => this.logger.error('Save failed: ' + error)
      );
  }

  exportBitesToURL(biteList: Bite[]): string {
    biteList = biteList ? biteList : [];

    let modifiedBiteList = this.unpopulateListOfBites(biteList);
    return encodeURIComponent(JSON.stringify(modifiedBiteList));
  }

  /**
   *
   * @param biteList
   * @return {Bite[]} A new list with cloned object. The fields that were populated from the source data will be emptied.
   */
  private unpopulateListOfBites(biteList: Bite[]): Bite[] {

    /* This is an ugly hack to not modify the original bites by cloning them */
    let modifiedBiteList = JSON.parse(JSON.stringify(biteList));
    modifiedBiteList.forEach(bite => BiteLogicFactory.createBiteLogic(bite).unpopulateBite());
    return modifiedBiteList;
  }

  generateAvailableBites(): Observable<Bite> {
    return this.cookBookService.load(this.url);
  }

  initBite(bite: Bite): Observable<Bite> {
    return this.recipeService.myProcessBite(bite, this.url);
  }

  resetBites() {
    this.domEventService.sendCancelledEvent();
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }

  addBite(bite: Bite, bites: Bite[], availableBites: Bite[], replaceIndex?: number) {

    /* Removing bite from list of available bites */
    const index = BiteService.findBiteInArray(bite, availableBites);
    availableBites.splice(index, 1);

    this.initBite(bite)
      .subscribe(
        b => {
          if (replaceIndex == null) {
            bites.push(b);
          } else {
            bites[replaceIndex] = b;
          }
        },
        err => {
          this.logger.error('Can\'t process bite due to:' + err);
          availableBites.push(bite);
        }
      );
  }

  /**
   *
   * @param oldBite bite to be removed from bites list and added to availableBites
   * @param newBite bite to be added to bites list and removed from availableBites
   * @param bites
   * @param availableBites
   */
  switchBites(oldBite: Bite, newBite: Bite, bites: Bite[], availableBites: Bite[]) {
    if (bites) {
      const index: number = BiteService.findBiteInArray(oldBite, bites);
      if (index >= 0) {
        availableBites.push(this.resetBite(oldBite));
        this.addBite(newBite, bites, availableBites, index);
      }
    }
  }

}
