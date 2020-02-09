/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { AppConfigService } from '../../shared/app-config.service';

describe('Service: Analytics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, AppConfigService]
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
