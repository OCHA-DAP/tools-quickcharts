import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { KeyFigureBite } from '../bite/types/key-figure-bite';
import { ChartBite } from '../bite/types/chart-bite';
import { Observable } from 'rxjs';
import { HxlproxyService } from './hxlproxy.service';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class RecipeService {

  constructor(private hxlProxyService: HxlproxyService, private logger: Logger) { }

  // testProcessBite() {
  //   let bite1 = new KeyFigureBite('KF Bite', '#affected+buildings+partially', 'PRE', 'POST', 'descr');
  //   let bite2 = new ChartBite('KF Bite', '#affected+buildings+partially', '#adm1+name');
    // this.myProcessBite(bite1,
    //   'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
    // ).subscribe( (bite: Bite) => {
    //   let ret = JSON.stringify(bite);
    //   this.logger.log(ret);
    //   return ret;
    // });


    // this.myProcessBite(bite2,
    //   'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
    // ).subscribe( (bite: Bite) => {
    //   let ret = JSON.stringify(bite);
    //   this.logger.log(ret);
    //   return ret;
    // });
  //
  //
  //   this.myProcessAll([bite1, bite2],
  //     'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
  //   ).subscribe( (bite: Bite) => this.logger.log(JSON.stringify(bite) ) );
  // }

  myProcessBite(bite: Bite, datasetUrl: string): Observable<Bite> {
    return this.hxlProxyService.populateBite(bite, datasetUrl);
  }

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
    return bite.resetBite();
  }

  myProcessAll(bites: Bite[], datasetUrl: string): Observable<Bite> {
    let observables: Observable<Bite>[] = bites.map( bite => this.myProcessBite(bite, datasetUrl) );

    return Observable.concat(...observables);
  }

  processAll(bites: Bite[]): Promise<Bite[]> {
    let processed: Promise<Bite>[] = bites.map(bite => this.processBite(bite));
    return Promise.all(processed);
  }

}
