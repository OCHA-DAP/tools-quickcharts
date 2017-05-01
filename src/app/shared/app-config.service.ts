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

  public get(key: string): string {
    if (this.config.hasOwnProperty(key)) {
      return this.config[key];
    } else {
      return environment[key];
    }
  }

}
