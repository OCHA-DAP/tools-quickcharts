import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, FilterOperation } from './hxl-operations';

export class FilterSettingTransformer extends AbstractHxlTransformer {

  constructor(private innerTransformer: AbstractHxlTransformer,
              private valueColumn: string, private filteredValues: number[]) {
    super(null);
  }

  buildRecipes(): BasicRecipe[] {
    let recipes: BasicRecipe[] = [];
    recipes.push(new FilterOperation(this.valueColumn, this.filteredValues).recipe);

    const innerRecipes: BasicRecipe[] = this.innerTransformer.buildRecipes();

    recipes = recipes.concat(innerRecipes);
    return recipes;
  }
}
