import { Bite } from '../../types/bite';
import { BiteLogic } from '../../types/bite-logic';
import { BasicRecipe } from './hxl-operations';

export abstract class AbstractHxlTransformer {

  protected  type: string;
  protected valueTags: string[];
  public groupByTags: string[];
  protected aggregateFunction: string;

  constructor(private biteLogic: BiteLogic) {
    if (biteLogic) {
      const bite = biteLogic.getBite();
      this.type = bite.type;
      this.valueTags = biteLogic.valueColumns;
      this.groupByTags = bite.ingredient.aggregateColumn ? [bite.ingredient.aggregateColumn] : [];
      this.aggregateFunction = bite.ingredient.aggregateFunction;
    }
  }

  abstract buildRecipes(): BasicRecipe[];

  public generateJsonFromRecipes(): string {
    return JSON.stringify(this.buildRecipes());
  }
}
