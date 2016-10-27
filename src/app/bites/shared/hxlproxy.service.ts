import { Injectable } from '@angular/core';
import {Logger} from 'angular2-logger/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, AsyncSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BiteInfo, AbstractHxlTransformer} from './hxlproxy-transformers/abstract-hxl-transformer';
import {ChartTransformer} from './hxlproxy-transformers/chart-transformer';

@Injectable()
export class HxlproxyService {

  private metaRows: string[][];
  private hxlFileUrl: string;

  constructor(private logger: Logger, private http: Http) {}
  // constructor(private logger: Logger, private http: Http) {
    // let observable = this.getMetaRows('https://test-data.humdata.org/dataset/' +
    //   '8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv');
    // observable.subscribe( this.testResponse.bind(this) );
    // this.getDataForBite({type: 'chart', groupByTags: ['#adm1+name', '#adm1+code'], valueTag: '#affected+buildings+partially'});
  // }

  getMetaRows(hxlFileUrl: string): Observable<string [][]> {
    this.hxlFileUrl = hxlFileUrl;
    let url = `${environment.hxlProxy}?url=${encodeURIComponent(hxlFileUrl)}`;
    let myObservable: Observable<string[][]>;
    if (this.metaRows) {
      this.logger.log('Using cached metarows');
      let mySubject = new AsyncSubject<string[][]>();
      mySubject.next(this.metaRows);
      mySubject.complete();
      myObservable = mySubject;
    } else {
      myObservable = this.http.get(url).map(this.processMetaRowResponse.bind(this)).catch(err => this.handleError(err));
    }
    return myObservable;
  }

  getDataForBite(biteInfo: BiteInfo): Observable<any[][]> {
    let transformer: AbstractHxlTransformer;
    switch (biteInfo.type) {
      default:
        transformer = new ChartTransformer(biteInfo);
        break;
    }
    let recipesStr = transformer.buildRecipes();
    this.logger.log(recipesStr);

    return this.makeCallToHxlProxy([{key: 'recipe', value: recipesStr}], null);
  }

  private makeCallToHxlProxy(params: {key: string, value: string}[],
                             mapFunction: (response: Response) => any[][]): Observable<any [][]> {

    let myMapFunction: (response: Response) => any[][];
    if (mapFunction) {
      myMapFunction = mapFunction;
    } else {
      myMapFunction = (response: Response) => response.json();
    }

    let url = `${environment.hxlProxy}?url=${encodeURIComponent(this.hxlFileUrl)}`;
    for (let i = 0; i < params.length; i++) {
      url += '&' + params[i].key + '=' + encodeURIComponent(params[i].value);
    }
    this.logger.log('The call will be made to: ', url);
    return this.http.get(url).map(myMapFunction.bind(this)).catch(err => this.handleError(err));
  }

  private processMetaRowResponse(response: Response): string[][] {
    let json = response.json();

    let ret = [json[0], json[1]];
    this.logger.log('Response is: ' + ret);

    this.metaRows = ret;
    return ret;
  }

  // private testResponse(result) {
  //   this.logger.log('Test response is: ' + result);
  // }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.logger.error(errMsg);
    return Observable.throw(errMsg);
  }

}
