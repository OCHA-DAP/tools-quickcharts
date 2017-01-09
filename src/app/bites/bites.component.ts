import { Component, OnInit } from '@angular/core';
import {Bite} from './bite/types/bite';
import { Router, RouterState, ActivatedRoute, Params } from '@angular/router';
import { Logger } from 'angular2-logger/core';
import { BiteService } from './shared/bite.service';
import { AppConfigService } from '../shared/app-config.service';

@Component({
  selector: 'hxl-bites',
  templateUrl: './bites.component.html',
  styleUrls: ['./bites.component.less']
})
export class BitesComponent implements OnInit {
  private editMode: boolean;
  private onlyViewMode: boolean;
  private state: RouterState;

  constructor(router: Router, private logger: Logger, private biteService: BiteService,
              private appConfigService: AppConfigService) {

    this.editMode = false;
    this.onlyViewMode = false;
    this.state = router.routerState;
  }

  ngOnInit() {
    const root: ActivatedRoute = this.state.root;
    const child = root.firstChild;
    this.logger.info('Bites Component on init');
    child.params.subscribe(
      (params: Params) => {
        this.appConfigService.init(params);
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
