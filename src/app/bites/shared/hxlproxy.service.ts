import { Injectable } from '@angular/core';
import {Logger} from "angular2-logger/core";
import {Http, Response} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable()
export class HxlproxyService {

  constructor(private logger: Logger, private http: Http) {}

  getMetaRows(hxlFileUrl: string): Observable<string [][]> {
    let url = environment.hxlProxy + "?url=" + encodeURIComponent(hxlFileUrl);

    return this.http.get(url).map(this.processResponse.bind(this)).catch(err => this.handleError(err));
  }

  private processResponse(response: Response) : string[][] {
    let json = response.json();

    let ret = [json[0], json[1]];
    this.logger.log("Response is: " + ret);
    return ret;
  }

  // private testResponse(result) {
  //   this.logger.log("Test response is: " + result);
  // }

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
