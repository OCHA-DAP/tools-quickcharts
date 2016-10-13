import {Bite} from "./bite";
export class ToplineBite extends Bite {
  public value: number;

  constructor(title: string) {
    super(title, ToplineBite.type());
  }

  static type(): string {
    return "topline";
  }
}
