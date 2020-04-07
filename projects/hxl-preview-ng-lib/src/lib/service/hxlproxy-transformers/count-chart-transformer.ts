import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, CountOperation, RenameOperation, SortOperation } from './hxl-operations';

export class CountChartTransformer extends AbstractHxlTransformer {

  // protected metaTagForAggColumn = '#meta+count';

  // protected nameForAggregatedValueColumn(): string {
  //   return '#count';
  // }

  buildRecipes(): BasicRecipe[] {
    const recipes: BasicRecipe[] = [];

    const countOperation = new CountOperation(this.valueTags, this.groupByTags, this.aggregateFunction);
    recipes.push(countOperation.recipe);

    if (this.groupByTags) {
      let dateTag: string = null;
      for (let i = 0; i < this.groupByTags.length; i++) {
        const tag = this.groupByTags[i];
        if (tag.indexOf('#date') >= 0) {
          dateTag = tag;
          break;
        }
      }
      if (dateTag) {
        const sortOperation = new SortOperation(dateTag, true);
        recipes.push(sortOperation.recipe);
      } else if (this.groupByTags.length > 0) {
        const sortOperation = new SortOperation(this.groupByTags[0], true);
        recipes.push(sortOperation.recipe);
      }
    }



    // let cutOperation = new CutOperation('#meta+sum', this.biteInfo.groupByTags);
    // recipes.push(cutOperation.recipe);

    // const renameOperation = new RenameOperation(this.metaTagForAggColumn, this.nameForAggregatedValueColumn(), null);
    // recipes.push(renameOperation.recipe);

    return recipes;
  }

}
