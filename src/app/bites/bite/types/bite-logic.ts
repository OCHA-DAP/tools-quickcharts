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

    if (!this.bite.displayedDataTitle) {
      this.bite.displayedDataTitle = this.bite.dataTitle;
    }

    return this;
  }

  /**]
   * Generally used before saving the bite. We don't want the values to be saved as well.
   * The bites should have fresh data loaded from the data source each time.
   *
   * @return {BiteLogic}
   */
  public unpopulateBite(): BiteLogic {
    this.bite.dataTitle = null;
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
    return this.bite;
  }

  public populateHashCode(): void {
    this.bite.hashCode = this.strListHash(this.buildImportantPropertiesList());
  }

  protected buildImportantPropertiesList(): string[] {
    let importantProperties: string[] = [];
    importantProperties.push(this.bite.initialTitle, this.bite.type);
    importantProperties.push(this.bite.ingredient.valueColumn, this.bite.ingredient.aggregateColumn);
    return importantProperties;
  }

  protected strHash(theString: string, startHash?: number): number {
    let i, chr, len;
    let hash = startHash ? startHash : 0;
    if (!theString || theString.length === 0) {
      return hash;
    }
    for (i = 0, len = theString.length; i < len; i++) {
      chr = theString.charCodeAt(i);
      /* tslint:disable */
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
      /* tslint:enable */
    }
    return hash;
  };

  protected strListHash(strList: string[]): number {
    let hash = 0;
    if (strList) {
      for (let i = 0; i < strList.length; i++) {
        let curStr = strList[i];
        hash = this.strHash(curStr, hash);
      }
    }
    return hash;
  };

}
