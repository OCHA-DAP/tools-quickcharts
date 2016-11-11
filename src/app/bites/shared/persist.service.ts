import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { Observable } from 'rxjs';

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
