/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DomEventsService } from './dom-events.service';

describe('Service: DomEvents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomEventsService]
    });
  });

  it('should ...', inject([DomEventsService], (service: DomEventsService) => {
    expect(service).toBeTruthy();
  }));
});
