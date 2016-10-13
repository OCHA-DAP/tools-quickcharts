import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitesRoutingModule } from './bites-routing.module';
import { BitesComponent } from './bites.component';
import { BiteListComponent } from './bite-list/bite-list.component';
import { BiteComponent } from './bite/bite.component';
import { ContentToplineComponent } from './bite/content/content-topline/content-topline.component';
import { ContentChartComponent } from './bite/content/content-chart/content-chart.component';
import {BiteService} from "./shared/bite.service";
import {SortablejsModule} from "angular-sortablejs";
import {RecipeService} from "./shared/recipe.service";

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
  providers: [BiteService, RecipeService]
})
export class BitesModule { }
