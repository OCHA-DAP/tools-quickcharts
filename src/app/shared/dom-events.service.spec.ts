/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { DomEventsService } from './dom-events.service';

describe('Service: DomEvents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [DomEventsService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([DomEventsService], (service: DomEventsService) => {
    expect(service).toBeTruthy();
  }));
});
