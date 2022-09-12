import { Injectable } from '@angular/core';
import { NGXLogger as Logger } from 'ngx-logger';
import { AnalyticsService as GenericAnalyticsService, Bite, GA_PAGEVIEW, MapOfStrings } from 'hxl-preview-ng-lib';
import { AppConfigService } from '../../shared/app-config.service';

declare const ga: any;
declare const mixpanel: any;

const SINGLE_WIDGET_TEXT = 'single widget';
const ALL_WIDGETS_TEXT = 'all widgets';

/**
 * Service that will try to abstract sending the analytics events
 * to Google Analytics and Mixpanel, but do nothing if the libs are
 * not loaded
 */
@Injectable()
export class AnalyticsService {
  public static TRACK_EVENT_SETTINGS_OPEN: String = 'settings-open';
  public static TRACK_EVENT_SETTINGS_CHANGE: String = 'settings-change';
  public static TRACK_EVENT_CHART_SCROLL: String = 'chart-scroll';
  public static TRACK_EVENT_END_OF_BITES: String = 'chart-scroll';
  private eventTrack: Map<Bite, Map<String, Boolean>>;

  public mpToken: string;
  public gaToken: string;

  constructor(private logger: Logger, private appConfig: AppConfigService, private genericAnalyticsService: GenericAnalyticsService) {
    this.eventTrack = new Map<Bite, Map<String, Boolean>>();
  }

  public init() {
    // this.gaToken = this.appConfig.get('googleAnalyticsKey');
    this.mpToken = this.appConfig.thisIsProd() ?
        this.appConfig.get('prodMixpanelKey') : this.appConfig.get('testMixpanelKey');

    this.genericAnalyticsService.init(this.mpToken);
  }

  /**
   * Will check if the event has been triggered already, if not then set the event as triggered and return success
   * @param {String} eventName
   * @returns {Boolean} true if the change was successful
   */
  private trackEventAllowed(bite: Bite, eventName: String): Boolean {
    let currentTrack = this.eventTrack.get(bite);
    if (!currentTrack) {
      currentTrack = new Map<String, Boolean>();
      this.eventTrack.set(bite, currentTrack);
    }

    if (!currentTrack.get(eventName)) {
      currentTrack.set(eventName, true);
      return true;
    }
    return false;
  }

  private trackBiteSwitch(oldBite: Bite, newBite: Bite) {
    this.eventTrack.delete(oldBite);
  }


  public trackView(sample: string) {
    const mpData = {};
    if (sample === 'true') {
      mpData['sample'] = true;
    } else if (sample === 'false') {
      mpData['sample'] = false;
    }

    this.genericAnalyticsService.trackEventCategory('hxl preview', {}, mpData);
  }

  public trackSave() {
    this.genericAnalyticsService.trackEventCategory('hxl preview edit');
  }

  // private generateGATypeDimensionText(singleWidget: boolean): string {
  //   return singleWidget ? SINGLE_WIDGET_TEXT : ALL_WIDGETS_TEXT;
  // }

  private generateMPFormatText(isImage: boolean, singleWidget: boolean): string {
    let text = singleWidget ? SINGLE_WIDGET_TEXT : ALL_WIDGETS_TEXT;
    text += isImage ? ' snapped image' : ' link';
    return text;
  }

  public trackEmbed(embedUrl: string, singleWidget: boolean) {
    this.trackAction('action-embed');
    // const gaData: GaExtras = {
    //   category: 'quickcharts',
    //   action: 'share',
    //   label: embedUrl,
    //   dimensionInfo: {
    //     'dimension2': this.generateGATypeDimensionText(singleWidget)
    //   }
    // };

    const formatValue = this.generateMPFormatText(false, singleWidget);

    const gaData: MapOfStrings = {
      'format': formatValue,
      'type': 'quickchart',
      'url': embedUrl,
    };

    const mpData = {
      'share format': formatValue,
      'shared item': 'quickchart',
      'shared url': embedUrl
    };

    this.genericAnalyticsService.trackEventCategory('share', gaData, mpData);
  }
  public trackSaveImage( singleWidget: boolean) {
    this.trackAction('action-save-image');

    // const gaData: GaExtras = {
    //   category: 'quickcharts',
    //   action: 'share',
    //   label: 'image',
    //   dimensionInfo: {
    //     'dimension2': this.generateGATypeDimensionText(singleWidget)
    //   }

    // };
    const formatValue = this.generateMPFormatText(true, singleWidget);
    const gaData: MapOfStrings = {
      'format': formatValue,
      'type': 'quickchart',
    };

    const mpData = {
      'share format': formatValue,
      'shared item': 'quickchart',
    };
    this.genericAnalyticsService.trackEventCategory('share', gaData, mpData);
  }
  public trackSwitchBite(oldBite: Bite, newBite: Bite) {
    this.trackBiteSwitch(oldBite, newBite);
    this.trackAction('action-switch-bite');
    const mpData = {
      action: 'switch bite'
    };
    this.trackVizInteraction(mpData);
  }
  public trackSettingsMenuOpen(bite: Bite) {
    if (this.trackEventAllowed(bite, AnalyticsService.TRACK_EVENT_SETTINGS_OPEN)) {
      this.trackAction('action-settings-menu');
      const mpData = {
        action: 'open settings menu'
      };
      this.trackVizInteraction(mpData);
    }
  }
  public trackSettingsChanged(bite: Bite) {
    if (this.trackEventAllowed(bite, AnalyticsService.TRACK_EVENT_SETTINGS_CHANGE)) {
      this.trackAction('action-settings-changed');
      const mpData = {
        action: 'settings edit'
      };
      this.trackVizInteraction(mpData);
    }
  }
  public trackChartScroll(bite: Bite) {
    if (this.trackEventAllowed(bite, AnalyticsService.TRACK_EVENT_CHART_SCROLL)) {
      this.trackAction('action-chart-scroll');
      const mpData = {
        action: 'viz scroll'
      };
      this.trackVizInteraction(mpData);
    }
  }

  private trackVizInteraction(additionalMpData?: MapOfStrings) {
    const gaData = {
      'type': 'quickchart',
      'label': additionalMpData.action,
    };

    const mpData = Object.assign({
      'viz type': 'quickchart'
    }, additionalMpData);

    this.genericAnalyticsService.trackEventCategory('viz interaction', gaData, mpData);
  }

  private trackAction(actionName: string) {
    // TODO: remove
    console.warn('Tracking: ' + actionName);
  }

  trackNoMoreBitesToRender() {
    this.trackAction('action-no-more-bites-to-render');
  }
}
