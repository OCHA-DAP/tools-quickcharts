import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';

import { AppComponent } from './app.component';
import { BitesModule } from './bites/bites.module';
import { HxlBitesRoutingModule } from './app-routing.module';
import { AppConfigService } from './shared/app-config.service';
import { DomEventsService } from './shared/dom-events.service';
import { AnalyticsService } from './bites/shared/analytics.service';
import { LOG_LOGGER_PROVIDERS } from 'angular2-logger/app/core/providers';
import { HttpService } from './shared/http.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BitesModule,
    HxlBitesRoutingModule
  ],
  providers: [
    LOG_LOGGER_PROVIDERS,
    {
      provide: Http,
      useFactory: (backend: XHRBackend, options: RequestOptions) => {
        return new HttpService(backend, options);
      },
      deps: [XHRBackend, RequestOptions]
    },
    AppConfigService,
    AnalyticsService,
    DomEventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
