import {Bite} from './bite';

export class ChartBite extends Bite {
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  static type(): string {
    return 'chart';
  }

  constructor(title: string, dataTitle?: string) {
    super(title, ChartBite.type());
    this.dataTitle = dataTitle;
  }
}
