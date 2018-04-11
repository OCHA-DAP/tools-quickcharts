import { HxlPreviewConfig } from './persist/hxl-preview-config';
import { Injectable } from '@angular/core';
import { Bite } from 'hxl-preview-ng-lib';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class PersistService {

  constructor() { }

  /**
   *
   * @param bites customized bites to save
   * @param recipeUrl url from which the used recipes can be loaded
   * @param cookbookName unique identifier for the cookbook inside the recipes json file (more precisely, inside a
   *        cookbook library)
   *
   */
  abstract save(bites: Bite[], recipeUrl?: string, cookbookName?: string): Observable<boolean>;

  /**
   *
   * @return observable of an object containing the saved bites and recipe information
   */
  abstract load(): Observable<HxlPreviewConfig>;

}
