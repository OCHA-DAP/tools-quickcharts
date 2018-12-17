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
      /**
       * For filterWith we want AND filters. So we need to chain several FilterOperations together. One for each filter
       * in filterWith. A FilterOperation supports OR between the LIST of filters that is given as an argument.
       * So we need to transform the one filter to a list.
       */
      this.filters.filterWith.forEach(filter => {
        recipes.push(new FilterOperation([filter], true, this.specialFilterValues).recipe);
      });
    }
    if (this.filters.filterWithout) {
      recipes.push(new FilterOperation(this.filters.filterWithout, false, this.specialFilterValues).recipe);
    }

    const innerRecipes: BasicRecipe[] = this.innerTransformer.buildRecipes();

    recipes = recipes.concat(innerRecipes);
    return recipes;
  }
}
