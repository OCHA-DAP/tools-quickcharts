import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { KeyFigureBite } from '../bite/types/key-figure-bite';
import { ChartBite } from '../bite/types/chart-bite';
import { RecipeService } from './recipe.service';
import { BiteConfig } from '../bite/types/bite-config';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class BiteService {
  private savedBites: Bite[];
  private availableBites: Bite[];
  constructor(private recipeService: RecipeService, private logger: Logger) {
    this.init();
  }

  private init() {
    this.savedBites = [
      new KeyFigureBite('Total affected', 'Affected people', '', 'K',
        'Thousands of people affected by the crisis. This number is an estimate based on the field data.'),
      new KeyFigureBite('Aid budget', '#cash+sum', '$', 'mil', 'Total sum of the allocated budget for treating the crisis.'),
      new ChartBite('Evolution of deaths', '#affected+deaths')
    ];

    this.availableBites = [
      new ChartBite('Missing', '#affected+missing'),
      new KeyFigureBite('People in need'),
      new KeyFigureBite('Deaths topline'),
      new KeyFigureBite('New cases'),
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
    // load column data from HXL Proxy
    // let columnNames = [];
    // let hxlTags = [];
    // read recipes data
    let biteJsonList = require('../../../assets/bites-chart.json');
    let biteList: Array<BiteConfig> = [];
    for (let i = 0; i < biteJsonList.length; i++) {
      let bite: BiteConfig = <BiteConfig> biteJsonList[i];
      biteList.push(bite);
      console.log(bite);
    }

    this.logger.log(biteList);

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
