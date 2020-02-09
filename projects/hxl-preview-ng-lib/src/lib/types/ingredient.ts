import { AggregateFunctionOptions, HxlFilter } from './ingredients';
export class Ingredient {
  constructor(public aggregateColumn: string, public valueColumn: string,
              public aggregateFunction: AggregateFunctionOptions,
              public dateColumn?: string,
              public comparisonValueColumn?: string, public comparisonOperator?: string,
              public filters?: BiteFilters, public title?: string, public description?: string) { }
}

export class BiteFilters {
  constructor(public filterWith: HxlFilter[], public filterWithout: HxlFilter[]) {}

  public static mergeBiteFilters(biteFilters1: BiteFilters, biteFilters2: BiteFilters): BiteFilters {
    let newFilterWith = null;
    let newFilterWithout = null;
    if (biteFilters1) {
      newFilterWith = biteFilters1.filterWith || [];
      newFilterWithout = biteFilters1.filterWithout || [];
    } else {
      newFilterWith = [];
      newFilterWithout = [];
    }

    if (biteFilters2) {
      if (biteFilters2.filterWith) {
        newFilterWith = newFilterWith.concat(biteFilters2.filterWith);
      }
      if (biteFilters2.filterWithout) {
        newFilterWithout = newFilterWithout.concat(biteFilters2.filterWithout);
      }
    }

    return new BiteFilters(newFilterWith, newFilterWithout);
  }
}
