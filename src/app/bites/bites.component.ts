import { Component, OnInit } from '@angular/core';
import {Bite} from './bite/types/bite';
import { Router, RouterState, ActivatedRoute, Params } from '@angular/router';
import { Logger } from 'angular2-logger/core';
import { BiteService } from './shared/bite.service';

@Component({
  selector: 'hxl-bites',
  templateUrl: './bites.component.html',
  styleUrls: ['./bites.component.less']
})
export class BitesComponent implements OnInit {
  private editMode: boolean;
  private state: RouterState;

  constructor(router: Router, private logger: Logger, private biteService: BiteService) {
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
        this.logger.warn('URL is: ' + url);
        this.biteService.init('https://test-data.humdata.org/dataset/8b154975-4871-4634-b540-f6c77972f538/resource/' +
          '3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv');
      }
    );
  }

}
