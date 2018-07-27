import { Injectable } from '@angular/core';
import { Observable,  BehaviorSubject, timer as observableTimer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpEventsService } from './http-events.service';
declare const $: any;

@Injectable({
  providedIn: 'root',
})
export class HttpService implements HttpInterceptor {
  public pendingRequests = 0;
  public showLoading = false;

  constructor(private httpEventsService: HttpEventsService) {
  }

  changeShowLoading(value: boolean): void {
    this.showLoading = value;
    this.httpEventsService.loadingChange.next(value);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('In the intercept routine..');
    this.turnOnModal();
    return next.handle(req).pipe(
      // .catch((err, source) => {
      //   console.log('Caught error: ' + err);
      // })
      tap((res: HttpEvent<any>) => {
        // console.log('Response: ' + res);
      }, (err: any) => {
        // console.log('Caught error: ' + err);
      }),
      finalize(() => {
        // console.log('Finally.. delaying, though.');
        // this.turnOffModal();
        const timer = observableTimer(300);
        timer.subscribe(t => {
          this.turnOffModal();
        });
      }));
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
