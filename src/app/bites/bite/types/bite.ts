
import { Ingredient } from './ingredient';
export abstract class Bite {
  // internal flag to know if bite has been processed by recipe
  public init: boolean = false;
  // ingredient generated by cookbook generator, needed by recipe service
  public ingredient: Ingredient;
  // HXL Proxy generated: column name
  public title: string;
  // HXL Proxy generated: hxl tag
  public dataTitle: string;
  // internal to know what type of bite we have inside the template :)
  public type: string;

  constructor(title: string, type: string) {
    this.title = title;
    this.type = type;
  }

  public resetBite(): Bite {
    this.dataTitle = null;
    return this;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap): Bite {
    this.dataTitle = this.ingredient.valueColumn;
    this.title = tagToTitleMap[this.dataTitle];

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

}

