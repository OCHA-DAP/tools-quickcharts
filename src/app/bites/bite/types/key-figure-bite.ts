import { Bite } from './bite';
import { Ingredient } from './ingredient';
export class KeyFigureBite extends Bite {
  // HXL Proxy generated: value
  public value: number;

  /**
   * User properties
   */
  // text preceding "value"
  public preText: string;
  // text after "value"
  public postText: string;
  // description of key figure
  public description: string;

  static type(): string {
    return 'key figure';
  }

  constructor(title: string, valueColumn: string) {
    super(title, KeyFigureBite.type());
    this.ingredient = new Ingredient(null, valueColumn);
    this.dataTitle = valueColumn;
  }

}
