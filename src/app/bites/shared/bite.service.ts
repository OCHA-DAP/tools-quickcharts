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
}
