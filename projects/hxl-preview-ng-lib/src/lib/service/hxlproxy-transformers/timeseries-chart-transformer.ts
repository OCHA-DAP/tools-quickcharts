import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CleanOperation, SortOperation, FilterOperation } from './hxl-operations';
import { BiteLogic } from '../../types/bite-logic';

export class TimeseriesChartTransformer extends AbstractHxlTransformer {

  protected dateTag: string;

  constructor(private innerTransformer: AbstractHxlTransformer, biteLogic: BiteLogic) {
    super(null);
    this.dateTag = biteLogic.dateColumn;
    this.valueTags = biteLogic.valueColumns;
  }

  buildRecipes(): BasicRecipe[] {
    let recipes: BasicRecipe[] = [];

    const cleanOperation = new CleanOperation(this.dateTag);
    recipes.push(cleanOperation.recipe);

    const sortOperation = new SortOperation(this.dateTag);
    recipes.push(sortOperation.recipe);

    /* insert date as first grouping column */
    this.innerTransformer.groupByTags.splice(0, 0, this.dateTag);

    const innerRecipes: BasicRecipe[] = this.innerTransformer.buildRecipes();

    recipes = recipes.concat(innerRecipes);
    return recipes;
  }
}
