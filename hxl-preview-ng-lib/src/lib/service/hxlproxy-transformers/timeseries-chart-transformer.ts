import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CleanOperation, SortOperation } from './hxl-operations';

export class TimeseriesChartTransformer extends AbstractHxlTransformer {

  protected dateTag: string;
  protected innerTransformer: AbstractHxlTransformer;

  constructor(transformer: AbstractHxlTransformer, dateColumn: string) {
    super(null);
    this.dateTag = dateColumn;
    this.innerTransformer = transformer;
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
