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

  public computeBiteUnit(forceRecompute: boolean) {
    if (forceRecompute || this.bite.unit !== 'none') {
      if (this.bite.value > 1000000000.0) {
        this.bite.unit = 'bln';
      } else if (this.bite.value > 1000000.0) {
        this.bite.unit = 'mln';
      } else if (this.bite.value > 1000.0) {
        this.bite.unit = 'k';
      }
    }
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): KeyFigureBiteLogic {
    this.populateDataTitleWithHxlProxyInfo();
    const hxlTagIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);

    if (hxlTagIndex >= 0) {
      this.bite.value = hxlData[2][hxlTagIndex];
      this.computeBiteUnit(false);
      this.bite.init = true;
    } else {
      throw new Error(`${this.bite.ingredient.valueColumn} not found in hxl proxy response`);
    }
    return this;
  }

  public unpopulateBite(): BiteLogic {
    this.bite.value = null;
    return super.unpopulateBite();
  }

}

