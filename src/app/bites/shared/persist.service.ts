import { Injectable } from '@angular/core';
import { Bite } from '../bite/types/bite';
import { Observable } from 'rxjs';

@Injectable()
export abstract class PersistService {

  constructor() { }

  /**
   *
   * @param bites customized bites to save
   * @param persistanceOptions information needed by the server to store the bites ( For CKAN this would be the resource view id )
   *
   */
  abstract save(bites: Bite[], persistanceOptions: {}): Observable<boolean>;

  /**
   *
   * @param persistanceOptions information needed by the server to load the bites ( For CKAN this would be the resource view id )
   *
   * @return array of customized bites
   */
  abstract load(persistanceOptions): Observable<Bite[]>;

}
