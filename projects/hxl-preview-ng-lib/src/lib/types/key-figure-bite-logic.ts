import { UnitsUtil } from '../util/units-util';
import { BiteLogic, ColorUsage } from './bite-logic';
import { KeyFigureBite, KeyFigureDataProperties, KeyFigureUIProperties, KeyFigureComputedProperties } from './key-figure-bite';

export class KeyFigureBiteLogic extends BiteLogic {

  constructor(protected bite: KeyFigureBite) {
    super(bite);
  }

  public computeBiteUnit(forceRecompute: boolean) {
    if (forceRecompute || !this.computedProperties.unit) {
      this.computedProperties.unit = UnitsUtil.computeBiteUnit(this.dataProperties.value);
    }
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): KeyFigureBiteLogic {
    this.populateDataTitleWithHxlProxyInfo();
    const hxlTagIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);

    if (hxlTagIndex >= 0) {
      this.dataProperties.value = hxlData[2][hxlTagIndex];
      this.computeBiteUnit(false);
    } else {
      throw new Error(`${this.bite.ingredient.valueColumn} not found in hxl proxy response`);
    }
    return this;
  }

  public initUIProperties(): KeyFigureUIProperties {
    return new KeyFigureUIProperties();
  }
  public initComputedProperties(): KeyFigureComputedProperties {
    return new KeyFigureComputedProperties();
  }
  public initDataProperties(): KeyFigureDataProperties {
    return new KeyFigureDataProperties();
  }

  public colorUsage(): ColorUsage {
    return ColorUsage.NONE;
  }

  public get dataProperties(): KeyFigureDataProperties {
    return this.bite.dataProperties as KeyFigureDataProperties;
  }

  public get uiProperties(): KeyFigureUIProperties {
    return this.bite.uiProperties as KeyFigureUIProperties;
  }

  public get computedProperties(): KeyFigureComputedProperties {
    return this.bite.computedProperties as KeyFigureComputedProperties;
  }

  public get preText(): string {
    return this.uiProperties.preText;
  }

  public get postText(): string {
    return this.uiProperties.postText;
  }

  public get numberFormat(): string {
    return this.uiProperties.numberFormat;
  }

  public get unit(): string {
      const defaultUnit = this.computedProperties.unit;
      return this.uiProperties.unit == null ? defaultUnit : this.uiProperties.unit;
  }

  public get value(): number {
    return this.dataProperties.value;
  }

}

