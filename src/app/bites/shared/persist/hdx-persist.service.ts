import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { PersistService } from '../persist.service';
import { Bite } from '../../bite/types/bite';
import { AppConfigService } from '../../../shared/app-config.service';

/**
 * This persister assumes we have the following configurations available:
 * - "resource_view_id": resource view id
 * - "hdx_domain": the HDX/CKAN domain (ex: https://ckan.domain )
 */
@Injectable()
export class HdxPersistService extends PersistService {

  private static SAVE_PATH = '/api/action/resource_view_update';
  private static LOAD_PATH = '/api/action/resource_view_show?id=';

  constructor(private logger: Logger, private http: Http, private appConfig: AppConfigService) {
    super();
  }

  save(bites: Bite[]): Observable<boolean> {
    let mapFunction = (response: Response) => {
      let jsonResponse = response.json();
      if ( jsonResponse && jsonResponse.hasOwnProperty('success') && jsonResponse.success ) {
        return true;
      }
      return false;
    };

    let neededConfigs = this.getDomainAndViewId();

    let url = neededConfigs.hdxDomain + HdxPersistService.SAVE_PATH;
    this.logger.info('The save url is: ' + url);

    let hxlPreviewConfig = JSON.stringify(bites);

    return this.http.post(url, {id: neededConfigs.resourceViewId, hxl_preview_config: hxlPreviewConfig})
      .map(mapFunction).catch(err => this.handleError(err));
  }

  load(): Observable<Bite[]> {
    let mapFunction = (response: Response) => {
      let jsonResponse = response.json();
      if ( jsonResponse && jsonResponse.hasOwnProperty('success') && jsonResponse.success ) {
        let hxlPreviewConfig = jsonResponse.result.hxl_preview_config;
        if (hxlPreviewConfig) {
          return JSON.parse(hxlPreviewConfig);
        }
      }
      return [];
    };

    let neededConfigs = this.getDomainAndViewId();

    let url = neededConfigs.hdxDomain + HdxPersistService.LOAD_PATH + neededConfigs.resourceViewId;

    return this.http.get(url).map(mapFunction.bind(this)).catch(err => this.handleError(err));
  }

  private getDomainAndViewId() {
    let hdxDomain = this.appConfig.get('hdx_domain');
    let resourceViewId = this.appConfig.get('resource_view_id');

    if (!hdxDomain || !resourceViewId) {
      throw 'The hdx domain and the resource view need to be specified in order to save the config';
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
