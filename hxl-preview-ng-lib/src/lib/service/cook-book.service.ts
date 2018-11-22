
import { throwError as observableThrowError, Observable, forkJoin } from 'rxjs';
import { Pattern } from '../util/hxl/pattern';
import { Cookbook, CookbookLibrary, BiteConfig } from '../types/bite-config';
import { BiteFilters, Ingredient } from '../types/ingredient';
import { Injectable } from '@angular/core';

import { HxlproxyService } from './hxlproxy.service';
import { Bite } from '../types/bite';
import { ChartBite } from '../types/chart-bite';
import { KeyFigureBite } from '../types/key-figure-bite';
import { ComparisonChartBite } from '../types/comparison-chart-bite';
import { BiteLogicFactory } from '../types/bite-logic-factory';
import { AggregateFunctionOptions } from '../types/ingredients';
import { TimeseriesChartBite } from '../types/timeseries-chart-bite';
import { MyLogService } from './mylog.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, merge, mergeMap, publishLast, refCount, toArray } from 'rxjs/operators';

@Injectable()
export class CookBookService {

  private config: { [s: string]: string; } = {};

  // private cookBooks: string[];

  constructor(private logger: MyLogService, private hxlproxyService: HxlproxyService, private httpClient: HttpClient) {
    // this.cookBooks = [
    //   // 'assets/bites-chart.json',
    //   // 'assets/bites-key-figure.json',
    //   'https://raw.githubusercontent.com/OCHA-DAP/hxl-recipes/1.0.0/cookbook-library.json',
    // ];
  }

  private hxlMatcher(generalColumn: string, dataColumn: string): boolean {
    return Pattern.matchPatternToColumn(generalColumn, dataColumn);
  }

  private matchInSet(dataColumn: string, recipeColumns: string[]): boolean {
    return recipeColumns.filter(column => this.hxlMatcher(column, dataColumn)).length !== 0;
  }

  private findColsForComparisonChart(recipeColumns: string[], dataColumns: string[]): ComparisonBiteInfo[] {
    const comparisonBiteInfoList: ComparisonBiteInfo[] = [];
    recipeColumns.forEach(recipeCol => {
      // comp_sections should be something like: [1st_value_hxltag, comparison_operator, 2nd_value_hxltag]
      const comp_sections = recipeCol.split(' ');
      if (comp_sections.length === 3) {
        const info = new ComparisonBiteInfo(comp_sections[1]);
        dataColumns.forEach(dataCol => {
          if (Pattern.matchPatternToColumn(comp_sections[0], dataCol)) {
            info.valueCol = dataCol;
          } else if (Pattern.matchPatternToColumn(comp_sections[2], dataCol)) {
            info.comparisonValueCol = dataCol;
          }
        });
        if (info.isFilled()) {
          comparisonBiteInfoList.push(info);
        }
      } else {
        this.logger.error(`${recipeCol} should have 3 parts`);
      }
    });
    return comparisonBiteInfoList;
  }

  private allCookbookPatternsMatch(hxlPatterns: string[], hxlColumns: string[]): boolean {
    for (let i = 0; i < hxlPatterns.length; i++) {
      const pattern = hxlPatterns[i];
      let matches = false;
      for (let j = 0; j < hxlColumns.length; j++) {
        const col = hxlColumns[j];
        if (Pattern.matchPatternToColumn(pattern, col)) {
          matches = true;
          break;
        }
      }
      if (!matches) {
        return false;
      }
    };
    return true;
  }

  private determineCorrectCookbook(cookbooks: Cookbook[], hxlColumns: string[], chosenCookbookName?: string): Cookbook {
    const checkByName = (cookbook: Cookbook) => cookbook.name === chosenCookbookName;
    const checkByPattern = (cookbook: Cookbook) => {
      const hxlPatterns = cookbook.columns || [];
        hxlColumns = hxlColumns || [];
        if (this.allCookbookPatternsMatch(hxlPatterns, hxlColumns)) {
          return true;
        }
        return false;
    };

    const check = chosenCookbookName ? checkByName : checkByPattern;

    if (cookbooks && cookbooks.length > 0) {
      let selectedCookbook = cookbooks[0];

      // Setting default cookbook for the case when none will match
      for (let idx = 0; idx < cookbooks.length; idx++) {
        if (cookbooks[idx].default) {
          selectedCookbook = cookbooks[idx];
          break;
        }
      }
      let i = 0;
      for (i = 0; i < cookbooks.length; i++) {
        const cookbook = cookbooks[i];
        if (check(cookbook)) {
          selectedCookbook = cookbooks[i];
          break;
        }
      }
      selectedCookbook.selected = true;
      return selectedCookbook;
    }
    throw new Error('Cookbooks list is empty. Something went wrong !');
  }

  public determineAvailableBites(columnNames: Array<string>, hxlTags: Array<string>,
                                  biteConfigs: Array<BiteConfig>): Observable<Bite> {

    const bites: Observable<Bite> = new Observable<Bite>(observer => {
      biteConfigs.forEach((biteConfig) => {
        const aggregateColumns: Array<string> = [];
        const recipeColumns = biteConfig.ingredients.valueColumns;

        const dateColumns: Array<string> = [];

        let aggregateFunctions: AggregateFunctionOptions[] = biteConfig.ingredients.aggregateFunctions;
        if ( !aggregateFunctions || aggregateFunctions.length === 0 ) {
          aggregateFunctions = ['sum'];
        }


        let avAggCols: string[] = [];
        if (biteConfig.ingredients.aggregateColumns) {
          biteConfig.ingredients.aggregateColumns.forEach(col => {
            if (!(biteConfig.type === 'timeseries' && col.indexOf('#date') >= 0)) {
              aggregateColumns.push(col);
            }
          });

          // filter the available hxlTags, and not the recipe general tags
          avAggCols = hxlTags.filter(col => this.matchInSet(col, aggregateColumns));
          // avAggCols = aggregateColumns.filter(col => this.matchInSet(col, hxlTags));
        }

        let avValCols: string[] = [];
        let comparisonBiteInfoList: ComparisonBiteInfo[] = [];
        if (recipeColumns) {
          if (biteConfig.type === ComparisonChartBite.type()) {
            // avValCols will be empty in this case
            // We need to find data column pairs that match the recipe
            comparisonBiteInfoList = this.findColsForComparisonChart(recipeColumns, hxlTags);
          } else {
            // filter the available hxlTags, and not the recipe general tags
            avValCols = hxlTags.filter(col => this.matchInSet(col, recipeColumns));
          }

        }

        if (biteConfig.type === TimeseriesChartBite.type()) {
          hxlTags.forEach(col => {
            if (col.indexOf('#date') >= 0) {
              dateColumns.push(col);
            }
          });
        }

        this.logger.info(recipeColumns);

        const biteTitle = biteConfig.title;
        const biteDescription = biteConfig.description;
        const currentFilters = new BiteFilters(biteConfig.ingredients.filtersWith, biteConfig.ingredients.filtersWithout);
        switch (biteConfig.type) {
          case TimeseriesChartBite.type():
            dateColumns.forEach(dateColumn => {
              aggregateFunctions.forEach(aggFunction => {
                /* For count function we don't need value columns */
                const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                modifiedValueColumns.forEach(val => {
                  const general_ingredient = new Ingredient(null, val, aggFunction, dateColumn, null, null, currentFilters,
                                                    biteTitle, biteDescription);
                  const simple_bite = new TimeseriesChartBite(general_ingredient);
                  BiteLogicFactory.createBiteLogic(simple_bite).populateHashCode()
                    .populateWithTitle(columnNames, hxlTags);
                  observer.next(simple_bite);
                  avAggCols.forEach(agg => {
                    const ingredient = new Ingredient(agg, val, aggFunction, dateColumn, null, null, currentFilters,
                      biteTitle, biteDescription);
                    const multiple_data_bite = new TimeseriesChartBite(ingredient);
                    BiteLogicFactory.createBiteLogic(multiple_data_bite).populateHashCode()
                      .populateWithTitle(columnNames, hxlTags);
                    observer.next(multiple_data_bite);
                  });
                });
              });
            });

            break;
          case ComparisonChartBite.type():
            aggregateFunctions.forEach(aggFunction => {
              // We add a fake empty column for generating total comparisons (NOR grouped by any col)
              const avAggColsAndFake = avAggCols.length > 0 ? avAggCols : [''];
              avAggColsAndFake.forEach((agg) => {
                comparisonBiteInfoList.forEach(info => {
                  const ingredient = new Ingredient(agg, info.valueCol, aggFunction, null, info.comparisonValueCol,
                                        info.operator, currentFilters, biteTitle, biteDescription);
                  const bite = new ComparisonChartBite(ingredient);
                  BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                  observer.next(bite);
                });
              });
            });
            break;
          case ChartBite.type():
            aggregateFunctions.forEach(aggFunction => {
              avAggCols.forEach((agg) => {

                /* For count function we don't need value columns */
                const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                modifiedValueColumns.forEach(val => {
                  const ingredient = new Ingredient(agg, val, aggFunction, null, null, null, currentFilters,
                                                      biteTitle, biteDescription);
                  const bite = new ChartBite(ingredient);
                  BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                  observer.next(bite);
                });
              });
            });
            break;
          case KeyFigureBite.type():
            aggregateFunctions.forEach(aggFunction => {
              /* For count function we don't need value columns */
              const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
              modifiedValueColumns.forEach(val => {
                const ingredient = new Ingredient(null, val, aggFunction, null, null, null, currentFilters,
                                          biteTitle, biteDescription);
                const bite = new KeyFigureBite(ingredient);
                BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                observer.next(bite);
              });
            });
            break;
        }
      });
      observer.complete();
    });

    return bites;
  }

  load(url: string, recipeUrl: string, chosenCookbookName?: string):
          {biteObs: Observable<Bite>, cookbookAndTagsObs: Observable<CookbooksAndTags>} {

    let cookbookUrls = [recipeUrl];

    const cookBooksObs: Array<Observable<any>> = cookbookUrls.map(book => this.httpClient.get(book));
    const responseObs: Observable<any> = cookBooksObs.reduce((prev, current, idx) => prev.pipe(merge(current)));


    const toListOfCookbooks = (res: any) => {
      const configJson = res;
      let cookbooks: Cookbook[];
      if (Array.isArray(configJson)) {
        const recipes = <BiteConfig[]>configJson;
        const cookbook: Cookbook = {
          title: 'Untitled Cookbook',
          recipes: recipes,
          type: 'cookbook'
        };
        cookbooks = [cookbook];
      } else if (configJson.type && configJson.type === 'cookbook') {
        const cookbook = <Cookbook>configJson;
        cookbooks = [cookbook];
      } else if (configJson.type && configJson.type === 'cookbook-library') {
        const cookbookLibrary = <CookbookLibrary>configJson;
        cookbooks = cookbookLibrary.cookbooks;
      }
      return cookbooks;
    };

    /**
     * Observable<Response> -> Observable<Cookbook[]> with several events for each json file loaded
     *    -> Observable<Cookbook>
     *    -> Observable<Cookbook[]> one event containing a list with all the cookbooks from all files
     */
    const cookbookListObs = responseObs.pipe(
        mergeMap(toListOfCookbooks),
        toArray()
    );
    const metaRowsObs = this.hxlproxyService.fetchMetaRows(url);

    const cookbooksAndTagsObs = forkJoin(cookbookListObs, metaRowsObs).pipe(
      map( res => {
        const cookbooks: Cookbook[] = res[0];
        const rows = res[1];
        const columnNames: string[] = rows[0];
        const hxlTags: string[] = rows[1];
        const chosenCookbook = this.determineCorrectCookbook(cookbooks, hxlTags, chosenCookbookName);
        return {
          cookbooks: cookbooks,
          chosenCookbook: chosenCookbook,
          hxlTags: hxlTags,
          columnNames: columnNames,
        };
      })
    );

    cookbooksAndTagsObs.pipe(
      catchError(err => this.handleError(err))
    );

    /**
     * publishLast() - so that an observer subscribing later would receive the last notification again
     * refCount() - so that the first observer subscribing would trigger the start of the HTTP request
     *            ( otherwise a connect() would've been needed)
     */
    const publishedCookbooksAndTagsObs = cookbooksAndTagsObs
      .pipe(
        publishLast(),
        refCount()
      );

    const bites: Observable<Bite> = publishedCookbooksAndTagsObs
      .pipe(
        mergeMap( (res: any) => {
          return this.determineAvailableBites(res.columnNames, res.hxlTags, res.chosenCookbook.recipes);
        })
      );

    const availableCookbooksObs = publishedCookbooksAndTagsObs.pipe(
      map((res: any) => res.cookbooks)
    );

    return {
      biteObs: bites,
      cookbookAndTagsObs: publishedCookbooksAndTagsObs
    };
  }

  private handleError (error: any) {
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
    const retValue = observableThrowError(errMsg);
    return retValue;
  }

}

class ComparisonBiteInfo {
  public valueCol: string;
  public comparisonValueCol: string;

  constructor(public operator: string) {}

  public isFilled(): boolean {
    if (this.valueCol && this.comparisonValueCol && this.operator) {
      return true;
    }
    return false;
  }
}

export interface CookbooksAndTags {
  cookbooks: Cookbook[];
  chosenCookbook: Cookbook;
  hxlTags: string[];
  columnNames: string[];
};
