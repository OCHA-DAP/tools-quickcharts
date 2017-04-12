import { BiteLogic } from './bite-logic';
import { KeyFigureBite } from './key-figure-bite';

export class KeyFigureBiteLogic extends BiteLogic {

  constructor(protected bite: KeyFigureBite) {
    super(bite);
  }

  public resetBite(): KeyFigureBiteLogic {
    this.bite.value = null;
    super.resetBite();
    return this;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): KeyFigureBiteLogic {
    super.populateDataTitleWithHxlProxyInfo(hxlData, tagToTitleMap);
    const hxlTagIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);

    if ( hxlTagIndex >= 0 ) {
      this.bite.value = hxlData[2][hxlTagIndex];
      this.bite.init = true;
    } else {
      throw `${this.bite.ingredient.valueColumn} not found in hxl proxy response`;
    }
    return this;
  }


  public unpopulateBite(): BiteLogic {
    this.bite.value = null;
    return super.unpopulateBite();
  }


  public populateWithTitle(columnNames: string[], hxlTags: string[]): BiteLogic {
    if (!this.bite.title) {
      const availableTags = {};
      hxlTags.forEach((v, idx) => availableTags[v] = idx);

      switch (this.bite.ingredient.aggregateFunction) {
        case 'count':
          this.bite.setTitle('ROW COUNT');
          break;
        case 'distinct-count':
          this.bite.setTitle('UNIQUE ' + columnNames[availableTags[this.bite.ingredient.valueColumn]]);
          break;
        default:
          this.bite.setTitle(columnNames[availableTags[this.bite.ingredient.valueColumn]]);
      }
    }
    return this;
  }
}

