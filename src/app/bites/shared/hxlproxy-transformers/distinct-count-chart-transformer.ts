import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CountOperation, RenameOperation } from './hxl-operations';

export class DistinctCountChartTransformer extends AbstractHxlTransformer {

  buildRecipes(): string {
    const recipes: BasicRecipe[] = [];

    const countOperation1 = new CountOperation('', this.biteInfo.groupByTags.concat([this.biteInfo.valueTag]),
      'count');
    recipes.push(countOperation1.recipe);

    const countOperation2 = new CountOperation('', this.biteInfo.groupByTags,
      'count');
    recipes.push(countOperation2.recipe);

    const renameOperation = new RenameOperation('#meta+count', this.biteInfo.valueTag, null);
    recipes.push(renameOperation.recipe);

    return JSON.stringify(recipes);
  }

}
