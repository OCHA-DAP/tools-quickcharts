import { Injectable } from '@angular/core';
import {Bite} from "../bite/types/bite";
import {ToplineBite} from "../bite/types/topline-bite";
import {ChartBite} from "../bite/types/chart-bite";
import {RecipeService} from "./recipe.service";

@Injectable()
export class BiteService {
  private savedBites:Bite[];
  private availableBites: Bite[];
  constructor(private recipeService: RecipeService) {
    this.init();
  }

  private init() {
    this.savedBites = [
      new ToplineBite("Deaths topline"),
      new ChartBite("Evolution of new cases"),
      new ToplineBite("People in need")
    ];

    this.availableBites = [
      new ToplineBite("New cases"),
      new ChartBite("Evolution of deaths")
    ]
  }

  private loadBites(): Promise<Bite[]>{
    var clone = (JSON.parse(JSON.stringify(this.savedBites)));
    return Promise.resolve(clone);
  }

  getBites(): Promise<Bite[]> {
    let self = this;
    return this.loadBites()
      .then(bites => self.recipeService.processAll(bites));
  }

  saveBites(biteList:Bite[]) {
    this.savedBites = biteList;
  }

  //TODO: remove :)
  tempPersistAvailable(availableBites: Bite[]) {
    this.availableBites = availableBites;
  }

  generateAvailableBites(): Promise<Bite[]> {
    var clone = (JSON.parse(JSON.stringify(this.availableBites)));
    return Promise.resolve(clone);
  }

  initBite(bite: Bite): Promise<Bite> {
    return this.recipeService.processBite(bite);
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }
}
