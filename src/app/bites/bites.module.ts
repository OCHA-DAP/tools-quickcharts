import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitesRoutingModule } from './bites-routing.module';
import { BitesComponent } from './bites.component';
import { BiteListComponent } from './bite-list/bite-list.component';
import { BiteComponent } from './bite/bite.component';
import { ContentToplineComponent } from './bite/content/content-topline/content-topline.component';
import { ContentChartComponent } from './bite/content/content-chart/content-chart.component';
import { ContentTimeseriesChartComponent } from './bite/content/content-timeseries-chart/content-timeseries-chart.component';
import { ContentComparisonChartComponent } from './bite/content/content-comparison-chart/content-comparison-chart.component';
import { BiteService } from './shared/bite.service';
import { RecipeService } from './shared/recipe.service';
import { HxlproxyService } from 'hxl-preview-ng-lib';
import { CookBookService } from 'hxl-preview-ng-lib';
import { AnalyticsService } from 'hxl-preview-ng-lib';
import { InlineEditComponent } from './shared/inline-edit/inline-edit.component';
import { FormsModule } from '@angular/forms';
import { PersistService } from './shared/persist.service';
import { HdxPersistService } from './shared/persist/hdx-persist.service';
import { CommonModule as MyCommonModule } from '../common/common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { HxlPreviewLibModule } from 'hxl-preview-ng-lib';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BitesRoutingModule,
    FormsModule,
    MyCommonModule,
    HxlPreviewLibModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    BitesComponent,
    InlineEditComponent
  ],
  declarations: [BitesComponent, BiteListComponent, BiteComponent, ContentToplineComponent, ContentChartComponent, InlineEditComponent,
    ContentTimeseriesChartComponent,
    ContentComparisonChartComponent,
    ColorPickerComponent],
  providers: [
    BiteService,
    RecipeService,
    HxlproxyService,
    CookBookService,
    AnalyticsService,
    {
      provide: PersistService,
      useClass: HdxPersistService
    }
  ]
})
export class BitesModule { }
