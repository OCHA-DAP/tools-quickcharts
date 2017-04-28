import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CountOperation, RenameOperation } from './hxl-operations';

export class DistinctCountChartTransformer extends AbstractHxlTransformer {

  buildRecipes(): BasicRecipe[] {
    const recipes: BasicRecipe[] = [];

    const countOperation1 = new CountOperation('', this.groupByTags.concat([this.valueTag]),
      'count');
    recipes.push(countOperation1.recipe);

    const countOperation2 = new CountOperation('', this.groupByTags,
      'count');
    recipes.push(countOperation2.recipe);

    const renameOperation = new RenameOperation('#meta+count', this.valueTag, null);
    recipes.push(renameOperation.recipe);

    return recipes;
  }

}
