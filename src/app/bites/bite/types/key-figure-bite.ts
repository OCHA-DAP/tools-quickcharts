import { Bite } from './bite';
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

  constructor(title: string, dataTitle?: string, preText?: string, postText?: string, description?: string) {
    super(title, KeyFigureBite.type());

    this.dataTitle = dataTitle;
    this.preText = preText;
    this.postText = postText;
    this.description = description;
  }
}
