/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { NGXLogger as Logger } from 'ngx-logger';
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

  it('should use correct tokens', inject([AnalyticsService, AppConfigService],
    (service: AnalyticsService, configService: AppConfigService) => {

    configService.init({
      googleAnalyticsKey: 'ga-token',
      prodMixpanelKey: 'mp-prod-token',
      testMixpanelKey: 'mp-test-token',
      prodHostname: 'data.humdata.org'
    });

    service.init();
    expect(service.mpToken).toBe('mp-test-token');

    configService.init({
      googleAnalyticsKey: 'ga-token',
      prodMixpanelKey: 'mp-prod-token',
      testMixpanelKey: 'mp-test-token',
      prodHostname: 'localhost'
    });

      service.init();
      expect(service.mpToken).toBe('mp-prod-token');

  }));

});
