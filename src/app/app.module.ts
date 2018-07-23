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
import { LoggerModule, Options, Level } from 'simple-angular-logger';
import { environment } from '../environments/environment';
import { HxlproxyService, SimpleModule } from 'hxl-preview-ng-lib';
import { RecipeService } from './bites/shared/recipe.service';

export function loggerOptions(): Options {
  if (environment.production) {
    return { level: Level.WARN };
  } else {
    return { level: Level.LOG };
  }
}

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
    LoggerModule.forRoot(loggerOptions),
    SimpleModule
  ],
  providers: [
    HTTP_SERVICE_PROVIDERS,
    AppConfigService,
    AnalyticsService,
    HttpService,
    DomEventsService,
    HxlproxyService,
    RecipeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
