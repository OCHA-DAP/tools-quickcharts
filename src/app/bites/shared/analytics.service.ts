import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { AnalyticsService as GenericAnalyticsService, GA_PAGEVIEW } from 'hdxtools-ng-lib';
import { AppConfigService } from '../../shared/app-config.service';

declare const ga: any;
declare const mixpanel: any;

/**
 * Service that will try to abstract sending the analytics events
 * to Google Analytics and Mixpanel, but do nothing if the libs are
 * not loaded
 */
@Injectable()
export class AnalyticsService {

  constructor(private logger: Logger, private appConfig: AppConfigService, private genericAnalyticsService: GenericAnalyticsService) { }

  public init() {
    const gaToken = this.appConfig.get('googleAnalyticsKey');
    const mpToken = this.appConfig.thisIsProd() ?
        this.appConfig.get('prodMixpanelKey') : this.appConfig.get('testMixpanelKey');

    this.genericAnalyticsService.init(gaToken, mpToken);
  }

  public trackView() {
    this.genericAnalyticsService.trackEventCategory('hxl preview', {'type': GA_PAGEVIEW});
  }

  public trackSave() {
    this.genericAnalyticsService.trackEventCategory('hxl preview edit');
  }

}
