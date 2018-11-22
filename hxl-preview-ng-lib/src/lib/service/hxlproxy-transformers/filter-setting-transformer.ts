import { BiteFilters } from '../../types/ingredient';
import { AbstractHxlTransformer } from './abstract-hxl-transformer';
import { BasicRecipe, FilterOperation, SpecialFilterValues } from './hxl-operations';

export class FilterSettingTransformer extends AbstractHxlTransformer {

  constructor(private innerTransformer: AbstractHxlTransformer, private filters: BiteFilters,
              private specialFilterValues: SpecialFilterValues) {
    super(null);
  }

  buildRecipes(): BasicRecipe[] {
    let recipes: BasicRecipe[] = [];
    if (this.filters.filterWith) {
      recipes.push(new FilterOperation(this.filters.filterWith, true, this.specialFilterValues).recipe);
    }
    if (this.filters.filterWithout) {
      recipes.push(new FilterOperation(this.filters.filterWithout, false, this.specialFilterValues).recipe);
    }

    const innerRecipes: BasicRecipe[] = this.innerTransformer.buildRecipes();

    recipes = recipes.concat(innerRecipes);
    return recipes;
  }
}
