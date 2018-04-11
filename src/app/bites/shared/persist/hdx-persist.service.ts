import { HxlPreviewConfig } from './hxl-preview-config';
import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PersistService } from '../persist.service';
import { Bite } from 'hxl-preview-ng-lib';
import { AppConfigService } from '../../../shared/app-config.service';
import { AnalyticsService } from '../analytics.service';
import { PersisUtil } from './persist-util';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';

/**
 * This persister assumes we have the following configurations available:
 * - "resource_view_id": resource view id
 * - "hdx_domain": the HDX/CKAN domain (ex: https://ckan.domain )
 */
@Injectable()
export class HdxPersistService extends PersistService {

  private static SAVE_PATH = '/api/action/resource_view_update';
  private static LOAD_PATH = '/api/action/resource_view_show?id=';

  private persistUtil: PersisUtil;

  constructor(private logger: Logger, private http: Http, private appConfig: AppConfigService,
              private analytics: AnalyticsService) {
    super();
    this.persistUtil = new PersisUtil(logger);
  }

  save(bites: Bite[], recipeUrl?: string, cookbookName?: string): Observable<boolean> {
    const mapFunction = (response: Response) => {
      const jsonResponse = response.json();
      if ( jsonResponse && jsonResponse.hasOwnProperty('success') && jsonResponse.success ) {
        return true;
      }
      return false;
    };

    const neededConfigs = this.getDomainAndViewId(true);

    const url = neededConfigs.hdxDomain + HdxPersistService.SAVE_PATH;
    this.logger.info('The save url is: ' + url);

    const hxlPreviewConfig = this.persistUtil.bitelistToConfig(bites, recipeUrl, cookbookName);
    this.analytics.trackSave();
    return this.http.post(url, {id: neededConfigs.resourceViewId, hxl_preview_config: hxlPreviewConfig})
      .map(mapFunction).catch(err => this.handleError(err));
  }

  load(): Observable<HxlPreviewConfig> {
    const mapFunction = (response: Response) => {
      const jsonResponse = response.json();
      if ( jsonResponse && jsonResponse.hasOwnProperty('success') && jsonResponse.success ) {
        const hxlPreviewConfig = jsonResponse.result.hxl_preview_config;
        if (hxlPreviewConfig) {
          return this.persistUtil.configToBitelist(hxlPreviewConfig);
        }
      }
      throw new Error('There was a problem with the http json response !');
    };

    const neededConfigs = this.getDomainAndViewId(false);

    if (!neededConfigs.hdxDomain || !neededConfigs.resourceViewId) {
      return Observable.of({
        configVersion: 0,
        bites: []
      });
    }
    const url = neededConfigs.hdxDomain + HdxPersistService.LOAD_PATH + neededConfigs.resourceViewId;

    return this.http.get(url).map(mapFunction).catch(err => this.handleError(err));
  }

  private getDomainAndViewId(isSave) {
    const hdxDomain = this.appConfig.get('hdx_domain');
    const resourceViewId = this.appConfig.get('resource_view_id');

    if (isSave && (!hdxDomain || !resourceViewId)) {
      throw new Error('The hdx domain and the resource view need to be specified in order to save the config');
    }
    return {hdxDomain: hdxDomain, resourceViewId: resourceViewId};
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.logger.error(errMsg);
    return Observable.throw(errMsg);
  }
}
