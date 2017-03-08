import {AbstractHxlTransformer} from './abstract-hxl-transformer';
import {CountOperation, BasicRecipe, RenameOperation, CutOperation} from './hxl-operations';

export class ChartTransformer extends AbstractHxlTransformer {

  buildRecipes(): string {
    let recipes: BasicRecipe[] = [];

    let countOperation = new CountOperation(this.biteInfo.valueTag, this.biteInfo.groupByTags, 'sum');
    recipes.push(countOperation.recipe);

    // let cutOperation = new CutOperation('#meta+sum', this.biteInfo.groupByTags);
    // recipes.push(cutOperation.recipe);

    let renameOperation = new RenameOperation('#meta+sum', this.biteInfo.valueTag, null);
    recipes.push(renameOperation.recipe);

    return JSON.stringify(recipes);
  }
}
