/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PersistService } from './persist.service';

describe('Service: Persist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [PersistService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([PersistService], (service: PersistService) => {
    expect(service).toBeTruthy();
  }));
});
