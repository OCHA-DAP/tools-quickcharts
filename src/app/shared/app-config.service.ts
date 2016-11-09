import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfigService {
  private config = {};
  constructor() { }

  public init(params: any): void {
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        this.config[key] = params[key];
      }
    }
  }

  public get(key: string): string {
    if (this.config.hasOwnProperty(key)) {
      return this.config[key];
    } else {
      return environment[key];
    }
  }

}
