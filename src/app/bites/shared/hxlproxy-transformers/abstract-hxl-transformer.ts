import { Bite } from '../../bite/types/bite';
export type BiteInfo = {
  type: string,
  valueTag: string,
  groupByTags: string[]
};

export abstract class AbstractHxlTransformer {

  readonly jsonRecipe: any[];
  readonly biteInfo: BiteInfo;

  constructor(bite: Bite) {
    this.jsonRecipe = [];
    this.biteInfo = {
      type: bite.type,
      valueTag: bite.ingredient.valueColumn,
      groupByTags: [bite.ingredient.aggregateColumn]
    };
  }

  abstract buildRecipes();
}
