import {Bite} from "./bite";
export class ToplineBite extends Bite {
  public value: number;
  public column: string;
  public dataTitle: string;
  public preText: string;
  public postText: string;
  public description: string;

  constructor(title: string, column: string, dataTitle?: string, preText?: string, postText?: string, description?: string) {
    super(title, ToplineBite.type());
    this.column = column;
    this.dataTitle = column;

    if (dataTitle)
      this.dataTitle = dataTitle;
    this.preText = preText;
    this.postText = postText;
    this.description = description;
  }

  static type(): string {
    return "topline";
  }
}
