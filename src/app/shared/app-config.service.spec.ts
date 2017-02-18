/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';
import { Params } from '@angular/router';

describe('Service: AppConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService]
    });
  });

  it('should ...', inject([AppConfigService], (service: AppConfigService) => {
    expect(service).toBeTruthy();
  }));

  it('should parse params and be able to retrieve them', inject([AppConfigService], (service: AppConfigService) => {
    const
      KEY1 = 'key1',
      VAL1 = 'val1',
      KEY2 = 'key2',
      VAL2 = 'val2';

    let params: Params = {};
    params[KEY1] = VAL1;
    params[KEY2] = VAL2;

    service.init(params);
    expect(service.get(KEY1)).toBe(VAL1);
    expect(service.get(KEY2)).toEqual(VAL2);
  }));
});
