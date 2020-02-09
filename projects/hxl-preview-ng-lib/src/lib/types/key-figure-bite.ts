import { Bite, UIProperties, ComputedProperties, DataProperties } from './bite';
import { Ingredient, BiteFilters } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class KeyFigureBite extends Bite {

  static type(): string {
    return 'key figure';
  }

  constructor(ingredient: Ingredient) {
    super(ingredient);
    this.computedProperties = new KeyFigureComputedProperties();
    this.uiProperties = new KeyFigureUIProperties();
    this.dataProperties = new KeyFigureDataProperties();

    // Commented bc we do the same in BiteLogic.populateDataTitleWithHxlProxyInfo()
    // this.dataTitle = ingredient.valueColumn;

    this.displayCategory = 'Key Figures';
    // this.unit = null;
  }
}

export class KeyFigureUIProperties extends UIProperties {

    /* none (overwrites k, mln, bln) */
    public unit: string;

    /**
     * User properties
     */
    // text preceding "value"
    public preText: string;
    // text after "value"
    public postText: string;

    public numberFormat: string;
}

export class KeyFigureComputedProperties extends ComputedProperties {
      /* k, mln, bln */
      public unit: string;
}

export class KeyFigureDataProperties extends DataProperties {
  // HXL Proxy generated: value
  public value: number;
}
