import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject, timer as observableTimer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
declare const $: any;

@Injectable()
export class HttpEventsService {
  public loadingChange = new BehaviorSubject(false);

  constructor() {
    console.error('New httpInterceptor!');
    this.loadingChange.subscribe((value) => { console.warn('Interceptor:' + value); })
  }

}
