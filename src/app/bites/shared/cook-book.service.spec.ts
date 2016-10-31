/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CookBookService } from './cook-book.service';

describe('Service: CookBook', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookBookService]
    });
  });

  it('should ...', inject([CookBookService], (service: CookBookService) => {
    expect(service).toBeTruthy();
  }));
});
