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
    super.populateWithHxlProxyInfo(hxlData, tagToTitleMap);
    let hxlTagIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);

    if ( hxlTagIndex >= 0 ) {
      this.bite.value = hxlData[2][hxlTagIndex];
      this.bite.init = true;
    } else {
      throw `${this.bite.ingredient.valueColumn} not found in hxl proxy response`;
    }
    return this;
  }

}

