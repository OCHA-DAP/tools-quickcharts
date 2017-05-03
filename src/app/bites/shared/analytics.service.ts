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
      const key = this.appConfig.get('googleAnalyticsKey');
      if (key) {
        ga('create', key, 'auto');
        this.gaInitialised = true;
      }
    } catch (err) {
      this.logger.info('Can\'t initialize Google Analytics: ' + err);
    }

    try {
      const key = this.appConfig.get('mixpanelKey');
      if (key) {
        mixpanel.init(key);
        this.mpInitialised = true;
      }
    } catch (err) {
      this.logger.info('Can\'t initialize Mixpanel: ' + err);
    }
  }

  public trackView() {
    const category = 'hxl preview';
    let url: string;
    let pageTitle: string;
    try {
      url = (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href;
      pageTitle = window.parent ? window.parent.document.title : window.document.title;
    } catch (Exception) {
      /* we don't have access to the parent due to cross-origin */
      url = document.referrer;
      pageTitle = window.document.title;
      this.logger.log(`in security error because of cross origin - url is ${url} and pageTitle is ${pageTitle}`);
    }
    let gaData = {
      type: 'pageview',
      category: category,
      action: 'view',
      label: pageTitle || ''
    };
    let mpData = {
      category: category,
      metadata: {
        url: url,
        pageTitle: pageTitle,
      }
    };
    this.send(gaData, mpData);
  }

  public trackSave() {
    this.trackEventCategory('hxl preview edit');
  }

  public trackEventCategory(category: string) {
    let url = (window.location !== window.parent.location)
      ? document.referrer
      : document.location.href;
    let pageTitle = window.parent ? window.parent.document.title : window.document.title;
    let gaData = {
      type: 'event',
      category: category,
      label: pageTitle || ''
    };
    let mpData = {
      category: category,
      metadata: {
        url: url,
        pageTitle: pageTitle,
      }
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
