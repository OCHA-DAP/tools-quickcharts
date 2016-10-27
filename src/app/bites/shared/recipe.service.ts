import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { KeyFigureBite } from '../bite/types/key-figure-bite';
import { ChartBite } from '../bite/types/chart-bite';

@Injectable()
export class RecipeService {

  constructor() { }

  processBite(bite: Bite): Promise<Bite> {
    // TODO: refactor to separate processors
    switch (bite.type) {
      case KeyFigureBite.type():
        let toplineBite: KeyFigureBite = <KeyFigureBite>bite;
        toplineBite.value = Math.round(Math.random() * 10000) / 100;
        break;
      case ChartBite.type():
        let chartBite: ChartBite = <ChartBite>bite;
        chartBite.values = [];
        chartBite.values.push(chartBite.dataTitle);
        for (let i = 0; i < 5; i++) {
          chartBite.values.push(Math.round(Math.random() * 100));
        }
        chartBite.categories = ['Manabi', 'Napo', 'Guayas', 'El Oro', 'Galapagos'];
        break;
    }
    bite.init = true;
    return Promise.resolve(bite);
  }

  resetBite(bite: Bite): Bite {
    let newBite: Bite;
    switch (bite.type) {
      case KeyFigureBite.type():
        let toplineBite: KeyFigureBite = <KeyFigureBite>bite;
        newBite = new KeyFigureBite(toplineBite.title);
        break;
      case ChartBite.type():
        let chartBite: ChartBite = <ChartBite>bite;
        newBite = new ChartBite(chartBite.title);
        break;
    }
    return newBite;
  }

  processAll(bites: Bite[]): Promise<Bite[]> {
    let processed: Promise<Bite>[] = bites.map(bite => this.processBite(bite));
    return Promise.all(processed);
  }

}
