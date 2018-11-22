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
}
