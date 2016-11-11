/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HdxPersistService } from './hdx-persist.service';

describe('Service: HdxPersist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HdxPersistService]
    });
  });

  it('should ...', inject([HdxPersistService], (service: HdxPersistService) => {
    expect(service).toBeTruthy();
  }));
});
