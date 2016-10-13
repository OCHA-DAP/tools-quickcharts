import {Bite} from "./bite";

export class ChartBite extends Bite {
  public values: number[];

  constructor(title: string) {
    super(title, ChartBite.type());
  }

  static type(): string {
    return "chart";
  }
}
