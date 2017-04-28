import { Bite } from '../../bite/types/bite';
import { BasicRecipe } from './hxl-operations';

export abstract class AbstractHxlTransformer {

  protected  type: string;
  protected valueTag: string;
  public groupByTags: string[];
  protected aggregateFunction: string;

  constructor(bite: Bite) {
    if (bite) {
      this.type = bite.type;
      this.valueTag = bite.ingredient.valueColumn;
      this.groupByTags = [bite.ingredient.aggregateColumn];
      this.aggregateFunction = bite.ingredient.aggregateFunction;
    }
  }

  abstract buildRecipes(): BasicRecipe[];

  public generateJsonFromRecipes(): string {
    return JSON.stringify(this.buildRecipes());
  }
}
