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
  private state: RouterState;

  constructor(router: Router, private logger: Logger, private biteService: BiteService,
              private appConfigService: AppConfigService) {

    this.editMode = false;
    this.state = router.routerState;
  }

  ngOnInit() {
    const root: ActivatedRoute = this.state.root;
    const child = root.firstChild;
    this.logger.info('Bites Component on init');
    child.params.subscribe(
      (params: Params) => {
        const url = params['url'];
        const editMode = params['editMode'];
        if (editMode === 'true') {
          this.editMode = true;
        }
        this.logger.warn('URL is: ' + url);
        this.biteService.init(url);
        this.appConfigService.init(params);
      }
    );
  }

}
