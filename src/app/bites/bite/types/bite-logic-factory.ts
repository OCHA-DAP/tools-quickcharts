import { Bite } from './bite';
import { BiteLogic } from './bite-logic';
import { KeyFigureBite } from './key-figure-bite';
import { KeyFigureBiteLogic } from './key-figure-bite-logic';
import { ChartBite } from './chart-bite';
import { ChartBiteLogic } from './chart-bite-logic';

export class BiteLogicFactory {
  public static createBiteLogic(bite: Bite): BiteLogic{
    if (bite) {
      switch (bite.type) {
        case KeyFigureBite.type():
          return new KeyFigureBiteLogic(bite as KeyFigureBite);
        case ChartBite.type():
          return new ChartBiteLogic(bite as ChartBite);
        default:
          return null;
      }
    }
    return null;
  }
}
