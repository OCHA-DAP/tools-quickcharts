import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response } from '@angular/http';
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare const $: any;

@Injectable()
export class HttpService extends Http {
  public pendingRequests = 0;
  public showLoading = false;
  public loadingChange = new BehaviorSubject(false);

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  changeShowLoading(value: boolean): void {
    this.showLoading = value;
    this.loadingChange.next(value);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    // console.log('In the intercept routine..');
    this.turnOnModal();
    return observable
      // .catch((err, source) => {
      //   console.log('Caught error: ' + err);
      // })
      .do((res: Response) => {
        // console.log('Response: ' + res);
      }, (err: any) => {
        // console.log('Caught error: ' + err);
      })
      .finally(() => {
        // console.log('Finally.. delaying, though.');
        // this.turnOffModal();
        const timer = Observable.timer(300);
        timer.subscribe(t => {
          this.turnOffModal();
        });
      });
  }

  private turnOnModal() {
    this.pendingRequests++;
    // console.log('In the turn on: ' + this.pendingRequests);
    if (!this.showLoading) {
      // $('body').spin('modal', '#FFFFFF', 'rgba(51, 51, 51, 0.1)');
      // console.log('Turned on modal');
    }
    this.changeShowLoading(true);
  }

  private turnOffModal() {
    if (this.pendingRequests > 0) {
      this.pendingRequests--;
    }
    // console.log('In the turn off: ' + this.pendingRequests);
    if (this.pendingRequests <= 0) {
      if (this.showLoading) {
        // $('body').spin('modal', '#FFFFFF', 'rgba(51, 51, 51, 0.1)');
      }
      this.changeShowLoading(false);
      // console.log('Turned off modal');
    }
  }
}
