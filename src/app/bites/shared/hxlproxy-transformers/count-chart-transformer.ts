import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CountOperation, RenameOperation } from './hxl-operations';

export class CountChartTransformer extends AbstractHxlTransformer {

  protected metaTagForAggColumn = '#meta+count';

  protected nameForAggregatedValueColumn(): string {
    return '#count';
  }

  buildRecipes(): BasicRecipe[] {
    const recipes: BasicRecipe[] = [];

    const countOperation = new CountOperation(this.valueTag, this.groupByTags, this.aggregateFunction);
    recipes.push(countOperation.recipe);

    // let cutOperation = new CutOperation('#meta+sum', this.biteInfo.groupByTags);
    // recipes.push(cutOperation.recipe);

    const renameOperation = new RenameOperation(this.metaTagForAggColumn, this.nameForAggregatedValueColumn(), null);
    recipes.push(renameOperation.recipe);

    return recipes;
  }

}
