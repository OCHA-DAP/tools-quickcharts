
import { throwError as observableThrowError,  Observable ,  AsyncSubject, forkJoin, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HxlFilter } from '../types/ingredients';
import { BiteFilters } from '../types/ingredient';
import { CountRecipe, SpecialFilterValues } from './hxlproxy-transformers/hxl-operations';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SumChartTransformer } from './hxlproxy-transformers/sum-chart-transformer';
import { Bite } from '../types/bite';
import { AbstractHxlTransformer } from './hxlproxy-transformers/abstract-hxl-transformer';
import { BiteLogicFactory } from '../types/bite-logic-factory';
import { CountChartTransformer } from './hxlproxy-transformers/count-chart-transformer';
import { DistinctCountChartTransformer } from './hxlproxy-transformers/distinct-count-chart-transformer';
import { TimeseriesChartTransformer } from './hxlproxy-transformers/timeseries-chart-transformer';
import { FilterSettingTransformer } from './hxlproxy-transformers/filter-setting-transformer';
import { MyLogService } from './mylog.service';

@Injectable()
export class HxlproxyService {

  private config: { [s: string]: any; } = {};

  private tagToTitleMap: any;
  private metaRows: string[][];
  private hxlFileUrl: string;

  private specialFilterValues:  SpecialFilterValues = {};

  constructor(private logger: MyLogService, private httpClient: HttpClient) {}
  // constructor(private logger: Logger, private http: Http) {
    // let observable = this.getMetaRows('https://test-data.humdata.org/dataset/' +
    //   '8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv');
    // observable.subscribe( this.testResponse.bind(this) );
    // this.getDataForBite({type: 'chart', groupByTags: ['#adm1+name', '#adm1+code'], valueTag: '#affected+buildings+partially'});
  // }

  public init(params: { [s: string]: any; }): void {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        this.config[key] = params[key];
      }
    }
  }

  fetchMetaRows(hxlFileUrl: string): Observable<string [][]> {
    this.hxlFileUrl = hxlFileUrl;

    let myObservable: Observable<string[][]>;
    if (this.metaRows && !this.config['noCachedMetarows']) {
      this.logger.log('Using cached metarows');
      const mySubject = new AsyncSubject<string[][]>();
      mySubject.next(this.metaRows);
      mySubject.complete();
      myObservable = mySubject;
    } else {
      myObservable = this.makeCallToHxlProxy<string[][]>([{key: 'max-rows', value: '0'}], this.processMetaRowResponse);
    }
    return myObservable;
  }

  private fetchFilterSpecialValues(filter: BiteFilters): Observable<SpecialFilterValues> {
    interface HxlProxyInput {
      key: string;
      recipes: string;
    }
    let myObservable = new AsyncSubject<SpecialFilterValues>();
    const inputs: HxlProxyInput[] = [];
    const availableSpecialValues = {
      '$MAX$': 'max',
      '$MIN$': 'min'
    };

    const createHxlProxyRecipes =  ((pair: HxlFilter) => {
      const column = Object.keys(pair)[0];
      const value = pair[column];
      if (Object.keys(availableSpecialValues).indexOf(value) >= 0) {
        const key = `${column}-${value}`;
        const aggFunction = availableSpecialValues[value];
        // If we haven't yet found the special value for this column (ex: max for #date+year) then get it now
        if (!this.specialFilterValues[key]) {
          const countRecipe = new CountRecipe(['#fakeColumn'], [`${aggFunction}(${column})`]);
          inputs.push({
            recipes: JSON.stringify([countRecipe]),
            key: key
          });

        }
      }
    });

    if (filter) {
      (filter.filterWith || []).forEach(createHxlProxyRecipes);
      (filter.filterWithout || []).forEach(createHxlProxyRecipes);
    }

    const hxlProxyObservables: Observable<boolean>[] = inputs.map(input => {
      return this.makeCallToHxlProxy([{ key: 'recipe', value: input.recipes }], (response: any) => {
        const ret: string[][] = response;
        // 2 header rows then comes the data, 1 fake column
        if (ret.length === 3 && ret[2].length > 1) {
          const specialValue = ret[2][1];
          this.specialFilterValues[input.key] = specialValue;
          return true;
        } else {
          console.error('Didn\'t get filter special value from hxl proxy');
          return false;
        }
      });
    });

    forkJoin(hxlProxyObservables).subscribe(null, null,
      () => {
        myObservable.next(this.specialFilterValues);
        myObservable.complete();
      });

    return myObservable;
  }

  populateBite(bite: Bite, hxlFileUrl: string): Observable<any> {
    return this.fetchMetaRows(hxlFileUrl)
        .pipe(
            flatMap(
                (metarows: string[][]) => {
                    const biteLogic = BiteLogicFactory.createBiteLogic(bite);
                    let transformer: AbstractHxlTransformer;
                    switch (bite.ingredient.aggregateFunction) {
                        case 'count':
                            transformer = new CountChartTransformer(biteLogic);
                            break;
                        case 'sum':
                            transformer = new SumChartTransformer(biteLogic);
                            break;
                        case 'distinct-count':
                            transformer = new DistinctCountChartTransformer(biteLogic);
                            break;
                    }
                    if (biteLogic.usesDateColumn()) {
                        transformer = new TimeseriesChartTransformer(transformer, biteLogic.dateColumn);
                    }
                    // if (bite.filteredValues && bite.filteredValues.length > 0) {
                    //   transformer = new FilterSettingTransformer(transformer, bite.ingredient.valueColumn, bite.filteredValues);
                    // }

                    return this.fetchFilterSpecialValues(bite.ingredient.filters)
                        .pipe(
                            flatMap( (specialFilterValues: SpecialFilterValues) => {
                                if (biteLogic.hasFilters()) {
                                    transformer = new FilterSettingTransformer(transformer, bite.ingredient.filters, specialFilterValues);
                                }

                                const recipesStr: string = transformer.generateJsonFromRecipes();
                                // this.logger.log(recipesStr);

                                const responseToBiteMapping = (response: any) =>
                                    biteLogic.populateWithHxlProxyInfo(response, this.tagToTitleMap).getBite();

                                const onErrorBiteProcessor = () => {
                                    biteLogic.getBite().errorMsg = 'Error while retrieving data values';
                                    return of(biteLogic.getBite());
                                };

                                return this.makeCallToHxlProxy<Bite>(
                                    [{key: 'recipe', value: recipesStr}], responseToBiteMapping, onErrorBiteProcessor
                                );
                            })
                        );
                }
            )
        );

  }

  /**
   * Makes a call to the hxl proxy
   * @param params parameter pairs that will be sent to the HXL Proxy in the URL (the data src url should not be specified here)
   * @param mapFunction function that will map the result to some data structure
   * @param errorHandler error handling function
   */
  private makeCallToHxlProxy<T>(params: {key: string, value: string}[],
                             mapFunction: (response: Response) => T,
                             errorHandler?: () => Observable<T>): Observable<T> {

    // let myMapFunction: (response: Response) => T;
    // if (mapFunction) {
    //   myMapFunction = mapFunction;
    // } else {
    //   myMapFunction = (response: Response) => response.json();
    // }

    let url = `${this.config['hxlProxy']}?url=${encodeURIComponent(this.hxlFileUrl)}`;
    if (params) {
      for (let i = 0; i < params.length; i++) {
        url += '&' + params[i].key + '=' + encodeURIComponent(params[i].value);
      }
    }
    this.logger.log('The call will be made to: ' + url);
    return this.httpClient.get(url).pipe(
        map(mapFunction.bind(this)),
        catchError(err => this.handleError(err, errorHandler))
    );
  }

  private processMetaRowResponse(response: any): string[][] {
    const ret: string[][] = response;

    // let ret = [json[0], json[1]];
    this.logger.log('Response is: ' + ret);
    this.metaRows = ret;

    this.tagToTitleMap = {};
    if (ret.length === 2) {
      for (let i = 0; i < ret[1].length; i++) {
        this.tagToTitleMap[ret[1][i]] = ret[0][i];
      }
    } else {
      throw new Error('There should be 2 meta rows');
    }

    return ret;
  }

  // private testResponse(result) {
  //   this.logger.log('Test response is: ' + result);
  // }

  private handleError (error: any, errorHandler?: () => Observable<any>) {
    let errMsg: string;
    // TODO: Response logic might need refactoring after switching to HttpClient in Angular 6
    if (error instanceof Response) {
      try {
        const body: any = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } catch (e) {
        errMsg = e.toString();
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error('ERR! ' + errMsg);
    const retValue = errorHandler ? errorHandler() : observableThrowError(errMsg);
    return retValue;
  }
}
