/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersistService } from './persist.service';

describe('Service: Persist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistService]
    });
  });

  it('should ...', inject([PersistService], (service: PersistService) => {
    expect(service).toBeTruthy();
  }));
});
