import { Injectable } from '@angular/core';
import { Bite } from 'hxl-preview-ng-lib';
import { Observable, concat } from 'rxjs';
import { HxlproxyService } from 'hxl-preview-ng-lib';
import { BiteLogicFactory } from 'hxl-preview-ng-lib';

@Injectable()
export class RecipeService {

  constructor(private hxlProxyService: HxlproxyService) { }

  // testProcessBite() {
  //   let bite1 = new KeyFigureBite('KF Bite', '#affected+buildings+partially', 'PRE', 'POST', 'descr');
  //   let bite2 = new ChartBite('KF Bite', '#affected+buildings+partially', '#adm1+name');
    // this.myProcessBite(bite1,
    //   'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-
    // 344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
    // ).subscribe( (bite: Bite) => {
    //   let ret = JSON.stringify(bite);
    //   this.logger.log(ret);
    //   return ret;
    // });


    // this.myProcessBite(bite2,
    //   'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-
    // 4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
    // ).subscribe( (bite: Bite) => {
    //   let ret = JSON.stringify(bite);
    //   this.logger.log(ret);
    //   return ret;
    // });
  //
  //
  //   this.myProcessAll([bite1, bite2],
  //     'https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-
  // 4bee-b5b0-6ddcfdc28fc8/download/eed.csv'
  //   ).subscribe( (bite: Bite) => this.logger.log(JSON.stringify(bite) ) );
  // }

  myProcessBite(bite: Bite, datasetUrl: string): Observable<Bite> {
    return this.hxlProxyService.populateBite(bite, datasetUrl);
  }

  resetBite(bite: Bite): Bite {
    return BiteLogicFactory.createBiteLogic(bite).resetBite().getBite();
  }

  processAll(bites: Bite[], datasetUrl: string): Observable<Bite> {
    const observables: Observable<Bite>[] = bites.map( bite => this.myProcessBite(bite, datasetUrl) );

    return concat(...observables);
  }

}
