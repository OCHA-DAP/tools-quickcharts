export type AggregateFunctionOptions = 'sum' | 'count';

export interface Ingredients {
  aggregateColumns: string[];
  valueColumns: string[];
  aggregateFunctions: AggregateFunctionOptions[];
}
