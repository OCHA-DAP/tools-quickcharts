import { Injectable } from '@angular/core';
import { Bite } from 'hdxtools-ng-lib';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class PersistService {

  constructor() { }

  /**
   *
   * @param bites customized bites to save
   *
   */
  abstract save(bites: Bite[]): Observable<boolean>;

  /**
   *
   * @return array of customized bites
   */
  abstract load(): Observable<Bite[]>;

}
