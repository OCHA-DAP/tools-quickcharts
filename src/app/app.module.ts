import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BitesModule } from './bites/bites.module';
import {LOG_LOGGER_PROVIDERS} from 'angular2-logger/core';
import { HxlBitesRoutingModule } from './app-routing.module';
import { AppConfigService } from './shared/app-config.service';
import { DomEventsService } from './shared/dom-events.service';

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
  providers: [LOG_LOGGER_PROVIDERS, AppConfigService, DomEventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
