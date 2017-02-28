import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { AppConfigService } from '../../shared/app-config.service';
declare var ga: any;
declare var mixpanel: any;

/**
 * Service that will try to abstract sending the analytics events
 * to Google Analytics and Mixpanel, but do nothing if the libs are
 * not loaded
 */
@Injectable()
export class AnalyticsService {
  private gaInitialised = false;
  private mpInitialised = false;

  constructor(private logger: Logger, private appConfig: AppConfigService) { }

  public init() {
    try {
      let key = this.appConfig.get('googleAnalyticsKey');
      ga('create', key, 'auto');
      this.gaInitialised = true;
    } catch (err) {
      this.logger.info('Can\'t initialize Google Analytics: ' + err);
    }

    try {
      let key = this.appConfig.get('mixpanelKey');
      mixpanel.init(key);
      this.mpInitialised = true;
    } catch (err) {
      this.logger.info('Can\'t initialize Mixpanel: ' + err);
    }
  }

  public trackView() {
    const category = 'hxl preview';
    let gaData = {
      type: 'pageview',
      category: category
    };
    let mpData = {
      category: category
    };
    this.send(gaData, mpData);
  }

  public trackSave() {
    this.trackEventCategory('hxl preview edit');
  }

  public trackEventCategory(category: string) {
    let gaData = {
      type: 'event',
      category: category
    };
    let mpData = {
      category: category
    };
    this.send(gaData, mpData);
  }

  private send(gaData: any, mpData: any) {
    // this.logger.info('Logging the event...');
    if (this.gaInitialised) {
      // this.logger.info('    Google Analytics - ok');
      ga('send', gaData.type, gaData.category, gaData.action, gaData.label);
    }

    if (this.mpInitialised) {
      // this.logger.info('    Mixpanel         - ok');
      mixpanel.track(mpData.category, mpData.metadata);
    }
  }

}
