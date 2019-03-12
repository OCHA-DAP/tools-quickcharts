import { HxlproxyService } from 'hxl-preview-ng-lib';
import { Component, OnInit } from '@angular/core';
import { Router, RouterState, ActivatedRoute, Params } from '@angular/router';
import { NGXLogger as Logger } from 'ngx-logger';
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

  static ALLOWED_DOMAINS_FOR_EXTERNAL_CSS = [
    'hpc.tools',
    'ralfbaumbach.org',
    'ocha-dap.github.io',
    'alexandru-m-g.github.io',
    'hum-insight.info'
  ]

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
        const externalCss = this.appConfigService.get('externalCss');
        if (this.parseUrlString(externalCss)) {
          this.externalCss = externalCss;
        }
        this.biteService.init();
      }
    );
  }

  private parseUrlString(url: string): boolean {
    if (url && url.indexOf('://')) {
      const restOfUrl = url.substr(url.indexOf('://') + 3);
      const hostname = restOfUrl.split('/')[0];
      for (const allowedDomains of BitesComponent.ALLOWED_DOMAINS_FOR_EXTERNAL_CSS) {
        if (hostname.endsWith(allowedDomains)) {
          return true;
        }
      }
    }
    return false;
  }

}
