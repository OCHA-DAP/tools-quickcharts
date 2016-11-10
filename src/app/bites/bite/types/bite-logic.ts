import { Bite } from './bite';
export abstract class BiteLogic {

  constructor(protected bite: Bite) {}

  public resetBite(): BiteLogic {
    this.bite.dataTitle = null;
    this.bite.title = this.bite.initialTitle;
    this.bite.init = false;
    return this;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): BiteLogic {
    this.bite.dataTitle = this.bite.ingredient.valueColumn;
    // this.bite.title = tagToTitleMap[this.bite.dataTitle];
    return this;
  }

  protected findHxlTagIndex(hxlTag: string, hxlData: any[][]): number {
    if (hxlData && hxlData.length > 2) {
      for (let i = 0; i < hxlData[1].length; i++) {
        let currentTag: string = hxlData[1][i];
        if (currentTag === hxlTag) {
          return i;
        }
      }
    }
    return -1;
  }

  public getBite(): Bite {
    return this.bite
  }

}
