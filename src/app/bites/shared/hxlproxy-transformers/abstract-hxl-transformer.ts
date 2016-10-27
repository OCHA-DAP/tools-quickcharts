export type BiteInfo = {
  type: string,
  valueTag: string,
  groupByTags: string[]
};

export abstract class AbstractHxlTransformer {

  readonly jsonRecipe: any[];
  readonly biteInfo: BiteInfo;

  constructor(biteInfo: BiteInfo) {
    this.jsonRecipe = [];
    this.biteInfo = biteInfo;
  }

  abstract buildRecipes();
}
