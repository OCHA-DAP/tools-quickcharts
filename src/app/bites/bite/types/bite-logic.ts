import {Bite} from './bite';

export abstract class BiteLogic {

  constructor(protected bite: Bite) {
  }

  public resetBite(): BiteLogic {
    this.bite.dataTitle = null;
    this.bite.title = this.bite.initialTitle;
    this.bite.init = false;
    return this;
  }

  protected populateDataTitleWithHxlProxyInfo(): BiteLogic {
    if (!this.bite.dataTitle) {
      this.bite.dataTitle = this.bite.ingredient.valueColumn;
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
    // this.bite.dataTitle = null;
    return this;
  }

  protected findHxlTagIndex(hxlTag: string, hxlData: any[][]): number {
    if (hxlData && hxlData.length > 2) {
      for (let i = 0; i < hxlData[1].length; i++) {
        const currentTag: string = hxlData[1][i];
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

  public populateHashCode(): BiteLogic {
    this.bite.hashCode = this.strListHash(this.buildImportantPropertiesList());
    return this;
  }

  protected buildImportantPropertiesList(): string[] {
    const importantProperties: string[] = [];
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
        const curStr = strList[i];
        hash = this.strHash(curStr, hash);
      }
    }
    return hash;
  };

  public populateWithTitle(columnNames: string[], hxlTags: string[]): BiteLogic {
    const availableTags = {};
    hxlTags.forEach((v, idx) => availableTags[v] = idx);

    const valueColumn = columnNames[availableTags[this.bite.ingredient.valueColumn]];
    const hxlValueColumn = hxlTags[availableTags[this.bite.ingredient.valueColumn]];
    const groupColumn = columnNames[availableTags[this.bite.ingredient.aggregateColumn]];
    let aggFunction = null;
    switch (this.bite.ingredient.aggregateFunction) {
      case 'count':
        aggFunction = 'Row Count';
        break;
      case 'distinct-count':
        aggFunction = 'Unique Values in';
        break;
      case 'sum':
        aggFunction = 'Sum of';
        break;
      default:
        aggFunction = 'Sum of';
        break;
    }

    let title = aggFunction;
    if (valueColumn && valueColumn.trim().length > 0) {
      title += ' ' + valueColumn;
    } else if (hxlValueColumn && hxlValueColumn.trim().length > 0) {
      title += ' ' + hxlValueColumn;
    }
    if (groupColumn && groupColumn.trim().length > 0) {
      title += ' grouped by ' + groupColumn;
    }
    this.bite.setTitle(title);

    return this;
  }

  public abstract populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): BiteLogic;

}
