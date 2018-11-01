import { HxlproxyService } from 'hxl-preview-ng-lib';
import { Component, OnInit } from '@angular/core';
import { Router, RouterState, ActivatedRoute, Params } from '@angular/router';
import { Logger } from 'simple-angular-logger';
import { BiteService } from './shared/bite.service';
import { AppConfigService } from '../shared/app-config.service';
import { AnalyticsService } from './shared/analytics.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'hxl-bites',
  templateUrl: './bites.component.html',
  styleUrls: ['./bites.component.less']
})
export class BitesComponent implements OnInit {
  onlyViewMode: boolean;
  recipeUrl: string;
  private state: RouterState;
  externalCss: string;

  constructor(router: Router, private logger: Logger, public sanitizer: DomSanitizer, private biteService: BiteService,
              private appConfigService: AppConfigService, private analyticsService: AnalyticsService,
              private hxlProxyService: HxlproxyService) {
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
        this.analyticsService.trackView(this.appConfigService.get('sample'));
        this.hxlProxyService.init({'hxlProxy': this.appConfigService.get('hxlProxy')});
        const onlyViewMode = this.appConfigService.get('onlyViewMode');
        if (onlyViewMode === 'true') {
          this.onlyViewMode = true;
        }
        this.externalCss = this.appConfigService.get('externalCss');

        this.biteService.init();
      }
    );
  }

}
