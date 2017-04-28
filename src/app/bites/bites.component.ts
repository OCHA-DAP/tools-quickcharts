import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterState, ActivatedRoute, Params } from '@angular/router';
import { Logger } from 'angular2-logger/core';
import { BiteService } from './shared/bite.service';
import { AppConfigService } from '../shared/app-config.service';
import { AnalyticsService } from './shared/analytics.service';
import { ContentChartComponent } from './bite/content/content-chart/content-chart.component';

@Component({
  selector: 'hxl-bites',
  templateUrl: './bites.component.html',
  styleUrls: ['./bites.component.less']
})
export class BitesComponent implements OnInit {
  editMode: boolean;
  onlyViewMode: boolean;
  recipeUrl: string;
  private state: RouterState;

  constructor(router: Router, private logger: Logger, private biteService: BiteService,
              private appConfigService: AppConfigService, private analyticsService: AnalyticsService) {
    this.editMode = false;
    this.onlyViewMode = false;
    this.state = router.routerState;
    this.recipeUrl = 'undefined';
  }

  ngOnInit() {
    const root: ActivatedRoute = this.state.root;
    const child = root.firstChild;
    this.logger.info('Bites Component on init');
    child.params.subscribe(
      (params: Params) => {
        this.appConfigService.init(params);
        this.analyticsService.init();
        this.analyticsService.trackView();
        const editMode = this.appConfigService.get('editMode');
        const onlyViewMode = this.appConfigService.get('onlyViewMode');
        if (onlyViewMode === 'true') {
          this.onlyViewMode = true;
        } else if (editMode === 'true') {
          this.editMode = true;
        }

        // this.logger.warn('URL is: ' + url);
        this.biteService.init(this.appConfigService.get('url'));

      }
    );
  }

}
