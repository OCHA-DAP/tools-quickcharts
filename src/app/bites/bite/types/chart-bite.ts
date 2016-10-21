import {Bite} from './bite';

export class ChartBite extends Bite {
  public values: any[];
  public categories: string[];
  public dataTitle: string;

  static type(): string {
    return 'chart';
  }

  constructor(title: string, dataTitle?: string) {
    super(title, ChartBite.type());
    this.dataTitle = dataTitle;
  }
}
