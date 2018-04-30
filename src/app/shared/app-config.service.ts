import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const window: any;

@Injectable()
export class AppConfigService {
  private config = {};
  constructor() { }

  public init(params: any): void {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        this.config[key] = params[key];
      }
    }

    this.initUrlParams();

  }

  protected initUrlParams() {
    const loc = window.location;

    this.config['loc_protocol'] = loc.protocol;
    this.config['loc_hostname'] = loc.hostname;
    this.config['loc_port'] = loc.port;
    this.config['loc_pathname'] = loc.pathname;
  }

  /**
   *
   * @param key name of the config parameter
   * @param includeEnvironment (optional) default true (look in environment for the request config)
   */
  public get(key: string, includeEnvironment?: boolean): string {
    includeEnvironment = includeEnvironment ? includeEnvironment : true;
    if (this.config.hasOwnProperty(key)) {
      return this.config[key];
    } else if (includeEnvironment) {
      return environment[key];
    }
    return null;
  }

  public thisIsProd() {
    return this.get('loc_hostname') === this.get('prodHostname');
  }

}
