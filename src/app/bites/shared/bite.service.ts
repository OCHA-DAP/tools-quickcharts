import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { KeyFigureBite } from '../bite/types/key-figure-bite';
import { ChartBite } from '../bite/types/chart-bite';
import { RecipeService } from './recipe.service';
import { BiteConfig } from '../bite/types/bite-config';
import { Logger } from 'angular2-logger/core';
import { CookBookService } from './cook-book.service';
import { Observable } from 'rxjs';

@Injectable()
export class BiteService {
  private savedBites: Bite[];
  private availableBites: Bite[];
  public url: string;

  constructor(private recipeService: RecipeService, private cookBookService: CookBookService,
              private logger: Logger) { }

  public init(url: string) {
    this.url = url;

    this.savedBites = [
      // new KeyFigureBite('Total affected', 'Affected people', '', 'K',
      //   'Thousands of people affected by the crisis. This number is an estimate based on the field data.'),
      // new KeyFigureBite('Aid budget', '#cash+sum', '$', 'mil', 'Total sum of the allocated budget for treating the crisis.'),
      // new ChartBite('Evolution of deaths', '#affected+deaths')
    ];

    this.availableBites = [
    ];

  }

  private loadBites(): Promise<Bite[]> {
    let clone = (JSON.parse(JSON.stringify(this.savedBites)));
    return Promise.resolve(clone);
  }

  getBites(): Promise<Bite[]> {
    let self = this;
    return this.loadBites()
      .then(bites => self.recipeService.processAll(bites));
  }

  saveBites(biteList: Bite[]) {
    this.savedBites = biteList;
  }

  // TODO: remove :)
  tempPersistAvailable(availableBites: Bite[]) {
    this.availableBites = availableBites;
  }

  generateAvailableBites(): Observable<Bite> {
    return this.cookBookService.load(this.url);

    // let clone = (JSON.parse(JSON.stringify(this.availableBites)));
    // return Promise.resolve(clone);
  }

  initBite(bite: Bite): Observable<Bite> {
    return this.recipeService.myProcessBite(bite, this.url);
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }
}
