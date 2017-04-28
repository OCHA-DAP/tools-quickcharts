import { AggregateFunctionOptions } from './ingredients';
export class Ingredient {
  constructor(public aggregateColumn: string, public valueColumn: string,
              public aggregateFunction: AggregateFunctionOptions, public dateColumn?: string) { }
}
