import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BitesModule } from './bites/bites.module';
import { HxlBitesRoutingModule } from './app-routing.module';
import { AppConfigService } from './shared/app-config.service';
import { DomEventsService } from './shared/dom-events.service';
import { AnalyticsService } from './bites/shared/analytics.service';
import { HttpService } from './shared/http.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// Import the module and model classes.
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';
import { HxlproxyService, HxlPreviewLibModule } from 'hxl-preview-ng-lib';
import { RecipeService } from './bites/shared/recipe.service';
import { HttpEventsService } from './shared/http-events.service';

export const HTTP_SERVICE_PROVIDERS: any = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpService,
  multi: true
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BitesModule,
    HxlBitesRoutingModule,
    LoggerModule.forRoot({level: environment.production ? NgxLoggerLevel.WARN : NgxLoggerLevel.LOG}),
    HxlPreviewLibModule
  ],
  providers: [
    HttpEventsService,
    HttpService,
    HTTP_SERVICE_PROVIDERS,
    AppConfigService,
    AnalyticsService,
    DomEventsService,
    HxlproxyService,
    RecipeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
