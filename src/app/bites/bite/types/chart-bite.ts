import {Bite} from "./bite";

export class ChartBite extends Bite {
  public values: any[];
  public categories: string[];
  public dataTitle: string;

  constructor(title: string, dataTitle?: string) {
    super(title, ChartBite.type());
    this.dataTitle = dataTitle;
  }

  static type(): string {
    return "chart";
  }
}
