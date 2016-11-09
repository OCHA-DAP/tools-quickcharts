import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitesRoutingModule } from './bites-routing.module';
import { BitesComponent } from './bites.component';
import { BiteListComponent } from './bite-list/bite-list.component';
import { BiteComponent } from './bite/bite.component';
import { ContentToplineComponent } from './bite/content/content-topline/content-topline.component';
import { ContentChartComponent } from './bite/content/content-chart/content-chart.component';
import { BiteService } from './shared/bite.service';
import { SortablejsModule } from 'angular-sortablejs';
import { RecipeService } from './shared/recipe.service';
import { HxlproxyService } from './shared/hxlproxy.service';
import { CookBookService } from './shared/cook-book.service';
import { PersistService } from './shared/persist.service';
import { HdxPersistService } from './shared/persist/hdx-persist.service';

@NgModule({
  imports: [
    CommonModule,
    BitesRoutingModule,
    SortablejsModule
  ],
  exports: [
    BitesComponent
  ],
  declarations: [BitesComponent, BiteListComponent, BiteComponent, ContentToplineComponent, ContentChartComponent],
  providers: [
    BiteService,
    RecipeService,
    HxlproxyService,
    CookBookService,
    {
      provide: PersistService,
      useClass: HdxPersistService
    }
  ]
})
export class BitesModule { }
