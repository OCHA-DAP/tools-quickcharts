import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { BiteConfig } from '../bite/types/bite-config';
import { HxlproxyService } from './hxlproxy.service';
import { Bite } from '../bite/types/bite';
import { ChartBite } from '../bite/types/chart-bite';
import { KeyFigureBite } from '../bite/types/key-figure-bite';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { BiteLogicFactory } from '../bite/types/bite-logic-factory';

@Injectable()
export class CookBookService {

  private cookBooks: string[];

  constructor(private logger: Logger, private hxlproxyService: HxlproxyService, private http: Http) {
    this.cookBooks = [
      'assets/bites-chart.json',
      'assets/bites-key-figure.json',
    ];
  }

  private hxlMatcher(generalColumn: string, dataColumn: string): boolean {
    if (generalColumn === dataColumn) {
      return true;
    }
    return dataColumn.startsWith(generalColumn + '+');
  }

  private matchInSet(dataColumn: string, recipeColumns: string[]): boolean {
    return recipeColumns.filter(column => this.hxlMatcher(column, dataColumn)).length !== 0;
  }

  private determineAvailableBites(columnNames: Array<string>, hxlTags: Array<string>,
                                  biteConfigs: Array<BiteConfig>): Observable<Bite> {

    let availableTags = {};
    hxlTags.forEach((v, idx) => availableTags[v] = idx);

    let bites: Observable<Bite> = new Observable<Bite>(observer => {
      biteConfigs.forEach((biteConfig) => {
        let aggregateColumns = biteConfig.ingredients.aggregateColumns;
        let valueColumns = biteConfig.ingredients.valueColumns;

        let avAggCols: string[] = [];
        if (aggregateColumns) {
          // filter the available hxlTags, and not the recipe general tags
          avAggCols = hxlTags.filter(col => this.matchInSet(col, aggregateColumns));
          // avAggCols = aggregateColumns.filter(col => this.matchInSet(col, hxlTags));
        }

        let avValCols: string[] = [];
        if (valueColumns) {
          // filter the available hxlTags, and not the recipe general tags
          avValCols = hxlTags.filter(col => this.matchInSet(col, valueColumns));
          // avValCols = valueColumns.filter(col => this.matchInSet(col, hxlTags));
        }

        this.logger.info(valueColumns);

        switch (biteConfig.type) {
          case ChartBite.type():
            avAggCols.forEach((agg) => {
              avValCols.forEach(val => {
                let bite = new ChartBite(columnNames[availableTags[val]], agg, val);
                BiteLogicFactory.createBiteLogic(bite).populateHashCode();
                observer.next(bite);
              });
            });
            break;
          case KeyFigureBite.type():
            avValCols.forEach(val => {
              let bite = new KeyFigureBite(columnNames[availableTags[val]], val);
              BiteLogicFactory.createBiteLogic(bite).populateHashCode();
              observer.next(bite);
            });
            break;
        }
      });
      observer.complete();
    });

    return bites;
  }

  load(url): Observable<Bite> {
    let cookBooksObs: Array<Observable<Response>> = this.cookBooks.map(book => this.http.get(book));
    let biteConfigs: Observable<BiteConfig[]> = cookBooksObs
      .reduce((prev, current, idx) => prev.merge(current))
      .map((res: Response) => res.json()[0])
      .map((biteConfig) => <BiteConfig>biteConfig)
      .toArray();
      // .subscribe(json => console.log(json);
    let metaRows = this.hxlproxyService.fetchMetaRows(url);

    let bites: Observable<Bite> = Observable.forkJoin(
      biteConfigs,
      metaRows
    )
      .flatMap(
        res => {
          let configs: BiteConfig[] = res[0];
          let rows = res[1];
          let columnNames: string[] = rows[0];
          let hxlTags: string[] = rows[1];

          return this.determineAvailableBites(columnNames, hxlTags, configs);
        }
      );

    bites.subscribe(bite => console.log(bite));

    return bites;
  }

}
