import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { RecipeService } from './recipe.service';
import { Logger } from 'angular2-logger/core';
import { CookBookService } from './cook-book.service';
import { Observable } from 'rxjs';
import { PersistService } from './persist.service';

@Injectable()
export class BiteService {
  public url: string;

  constructor(private recipeService: RecipeService, private cookBookService: CookBookService,
              private logger: Logger, private persistService: PersistService) { }

  public init(url: string) {
    this.url = url;
  }

  private loadBites(): Observable<Bite[]> {
    return this.persistService.load();
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
    // this.savedBites = biteList;
    this.persistService.save(biteList)
      .subscribe(
        (successful: boolean) => this.logger.log('Result of bites saved: ' + successful),
        error => this.logger.error('Save failed: ' + error)
      );
  }

  generateAvailableBites(): Observable<Bite> {
    return this.cookBookService.load(this.url);
  }

  initBite(bite: Bite): Observable<Bite> {
    return this.recipeService.myProcessBite(bite, this.url);
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }
}
