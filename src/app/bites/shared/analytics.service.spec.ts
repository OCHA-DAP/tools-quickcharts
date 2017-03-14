/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { Logger } from 'angular2-logger/core';
import { AppConfigService } from '../../shared/app-config.service';

describe('Service: Analytics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, Logger, AppConfigService]
    });
  });

  it('should ...', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
