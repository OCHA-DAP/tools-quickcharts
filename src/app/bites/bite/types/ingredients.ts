export type AggregateFunctionOptions = 'sum' | 'count' | 'distinct-count';

export interface Ingredients {
  aggregateColumns: string[];
  valueColumns: string[];
  aggregateFunctions: AggregateFunctionOptions[];
}
