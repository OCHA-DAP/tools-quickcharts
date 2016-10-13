/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BiteService } from './bite.service';

describe('Service: Bite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BiteService]
    });
  });

  it('should ...', inject([BiteService], (service: BiteService) => {
    expect(service).toBeTruthy();
  }));
});
