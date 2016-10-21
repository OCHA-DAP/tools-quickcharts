import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { ToplineBite } from '../bite/types/topline-bite';
import { ChartBite } from '../bite/types/chart-bite';
import { RecipeService } from './recipe.service';

@Injectable()
export class BiteService {
  private savedBites: Bite[];
  private availableBites: Bite[];
  constructor(private recipeService: RecipeService) {
    this.init();
  }

  private init() {
    this.savedBites = [
      new ToplineBite('Total affected', '#total+affected', 'Affected people', '', 'K',
        'Thousands of people affected by the crisis. This number is an estimate based on the field data.'),
      new ToplineBite('Aid budget', '#cash+sum', '#cash+sum', '$', 'mil', 'Total sum of the allocated budget for treating the crisis.'),
      new ChartBite('Evolution of deaths', '#affected+deaths')
    ];

    this.availableBites = [
      new ChartBite('Missing', '#affected+missing'),
      new ToplineBite('People in need', '#people+sum'),
      new ToplineBite('Deaths topline', '#deaths+sum'),
      new ToplineBite('New cases', '#cases+max'),
      new ChartBite('Wounded', '#affected+wounded'),
      new ChartBite('In Shelters', '#affected+inshelter'),
      new ChartBite('Buildings destroyed', '#affected+buildings+destroyed'),
      new ChartBite('Buildings affected', '#affected+buildings+partially')
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

  generateAvailableBites(): Promise<Bite[]> {
    let clone = (JSON.parse(JSON.stringify(this.availableBites)));
    return Promise.resolve(clone);
  }

  initBite(bite: Bite): Promise<Bite> {
    return this.recipeService.processBite(bite);
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }
}
