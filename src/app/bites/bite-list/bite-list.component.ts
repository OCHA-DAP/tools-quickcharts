import { SimpleDropdownPayload } from './../../common/component/simple-dropdown/simple-dropdown.component';
import { Bite, ChartBite, KeyFigureBite, TimeseriesChartBite, ComparisonChartBite } from 'hxl-preview-ng-lib';
import { Component, ElementRef, HostListener, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import {SortablejsOptions} from 'angular-sortablejs';
import {BiteService} from '../shared/bite.service';
import {Logger} from 'angular2-logger/core';
import {AppConfigService} from '../../shared/app-config.service';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { SimpleModalComponent } from 'hxl-preview-ng-lib';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { HttpService } from '../../shared/http.service';
import { Http } from '@angular/http';
import { AnalyticsService } from '../shared/analytics.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'hxl-bite-list',
  templateUrl: './bite-list.component.html',
  styleUrls: ['./bite-list.component.less']
})
export class BiteListComponent implements OnInit {
  biteList: Array<Bite>;
  availableBites: Array<Bite>;

  listIsFull: boolean;

  hxlUnsupported: boolean;
  spinnerActive = false;
  resetMode = false;

  smartChartsMenu: SimpleDropdownItem[];

  sortableMain: SortablejsOptions = {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true
  };

  protected showCookbookControls = false;

  @ViewChild('savedModal')
  private savedModal: SimpleModalComponent;
  protected savedModalMessage: string;

  @ViewChild('embedLinkModal')
  private embedLinkModal: SimpleModalComponent;

  @ViewChild('embedLinkInput')
  private embedLinkInput: ElementRef;

  embedUrl: string;
  iframeUrl: string;

  /* Used for when only one widget is embedded in a page */
  singleWidgetMode: boolean;
  toolsMode: boolean;

  @HostListener('window:message', ['$event'])
  onEmbedUrl($event) {
    const action = $event.data;
    const GET_EMBED_URL = 'getEmbedUrl:';
    if (action && action.startsWith && action.startsWith(GET_EMBED_URL)) {
      if (window.parent) {
        console.log('Sending event back to parent :)');
        const parentOrigin: string = action.slice(GET_EMBED_URL.length);
        // console.log(`Parent Origin: ${parentOrigin}`);
        const url = this.getEmbedLink();
        window.parent.postMessage(`embedUrl:${url}`, parentOrigin);
        return;
      }
    }
    console.log('Unknown message: ' + $event.data);
  }

  constructor(public biteService: BiteService, private appConfig: AppConfigService, private logger: Logger, http: Http,
              zone: NgZone, private analyticsService: AnalyticsService, @Inject( DOCUMENT ) private dom: Document) {
    // window['angularComponentRef'] = {component: this, zone: zone};

    this.biteList = [];
    this.listIsFull = false;
    this.logger = logger;
    this.hxlUnsupported = false;
    const httpService: HttpService = <HttpService>http;
    this.spinnerActive = httpService.loadingChange.value;
    httpService.loadingChange.distinctUntilChanged().debounce(val => Observable.timer(val ? 100 : 800)).subscribe((value) => {
      this.spinnerActive = value;
      console.log('SPINNER ACTIVE CHANGE;');
    });

    this.smartChartsMenu = [
      {
        displayValue: 'EXPORT ALL CHARTS',
        type: 'header',
        payload: null
      },
      {
        displayValue: 'Embed',
        type: 'menuitem',
        payload: {
          name: 'embed'
        }
      },
      {
        displayValue: 'Save as image',
        type: 'menuitem',
        payload: {
          name: 'image'
        }
      },
      {
        displayValue: 'Recipe controls:',
        type: 'togglemenuitem',
        payload: {
          name: 'show-recipe-section',
          checked: false
        }
      }

    ];

  }

  ngOnInit() {
    this.init();

    if (this.appConfig.get('has_modify_permission') === 'true') {
      this.smartChartsMenu.splice(0, 0,
        {
          displayValue: 'ADMIN SETTINGS',
          type: 'header',
          payload: null
        },
        {
          displayValue: 'Save the current views as default',
          type: 'menuitem',
          payload: {
            name: 'save-views'
          }
        },
        {
          displayValue: null,
          type: 'divider',
          payload: null
        }
      );
    }

    this.singleWidgetMode = this.appConfig.get('singleWidgetMode') === 'true';
    this.toolsMode = this.appConfig.get('toolsMode') === 'true';
  }

  private removeLoadedBiteToList(bite: Bite): void {
    this.biteList = this.biteList.filter(b => b !== bite);
    if (this.biteList.length <= +this.appConfig.get('maxBites')) {
      this.listIsFull = false;
    }
  }

  private load() {
    if (!this.resetMode) {
      this.biteService.getBites().subscribe(
        (bite: Bite) => {
          this.logger.log('Processing bite ' + JSON.stringify(bite));

          this.biteList.push(bite);
          this.logger.log('biteList ' + JSON.stringify(this.biteList));
        },
        errObj => {
          this.logger.log('load>getBites>in ERROR...');
        },
        () => {
          this.logger.log('load>getBites>on COMPLETE...');

          if (this.availableBites && this.biteList && this.availableBites.length !== 0 && this.biteList.length === 0) {
            this.loadDefaultBites();
          }
        }
      );
    } else {
      this.loadDefaultBites();
    }
  }

  // loads 3 bites as default when no other bites are saved
  private loadDefaultBites() {

    // splitting the bites by their type
    const listA = this.availableBites.filter(bite => bite.type === ChartBite.type() || bite.type === ComparisonChartBite.type());
    const listB = this.availableBites.filter(bite => bite.type === KeyFigureBite.type());
    const listC = this.availableBites.filter(bite => bite.type === TimeseriesChartBite.type());

    const handleValue = (value, observer) => {
      if (!value) {
        // we have exhausted all available bites, send event into analytics
        this.analyticsService.trackNoMoreBitesToRender();
      } else {
        observer.next(value);
      }
      observer.complete();
    };

    const observable = [
      new Observable<Bite>((observer) => {
        const value = listA.pop() || listB.pop() || listC.pop();
        handleValue(value, observer);
      }),
      new Observable<Bite>((observer) => {
        const value = listB.pop() || listC.pop() || listA.pop();
        handleValue(value, observer);
      }),
      new Observable<Bite>((observer) => {
        const value = listC.pop() || listA.pop() || listB.pop();
        handleValue(value, observer);
      })
    ];

    const processBite = (self, idx) => {
      const instance = (bite) => {
        if (!bite) {
          return;
        }
        self.addBite(bite).subscribe((val) => {
          if (!val) {
            observable[idx].subscribe(instance);
          }
        });
      };
      return instance;
    };
    observable[0].subscribe(processBite(this, 0));
    observable[1].subscribe(processBite(this, 1));
    observable[2].subscribe(processBite(this, 2));
  }

  init() {
    this.availableBites = null;
    this.biteList = [];
    this.logger.info('BiteListComponent on init');
    this.generateAvailableBites().subscribe(() => this.load());
  }

  copyToClipboard() {
    this.embedLinkInput.nativeElement.select();
    this.dom.execCommand('copy');
  }

  addBite(bite: Bite): Observable<boolean> {
    return this.biteService.addBite(bite, this.biteList, this.availableBites);
  }

  deleteBite(bite: Bite) {
    this.removeLoadedBiteToList(bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  switchBite(bitePair: { oldBite: Bite, newBite: Bite }) {
    this.biteService.switchBites(bitePair.oldBite, bitePair.newBite, this.biteList, this.availableBites);
  }

  generateAvailableBites(): Observable<boolean> {
    const observable = new AsyncSubject<boolean>();
    if (!this.availableBites) {
      this.availableBites = [];
      // const loadedHashCodeList: number[] = this.biteList ? this.biteList.map(bite => bite.hashCode) : [];
      this.biteService.generateAvailableBites()
        .subscribe(
          bite => {
            // this.logger.log('Available bite ' + JSON.stringify(bite));
            this.availableBites.push(bite);
          },
          errObj => {
            this.logger.log('in ERROR...');
            observable.next(false);
            observable.complete();
          },
          () => {
            this.logger.log('on COMPLETE...');
            if (this.availableBites && this.biteList && this.availableBites.length === 0 && this.biteList.length === 0) {
              // Your files contains HXL tags which are not supported by Quick Charts
              this.hxlUnsupported = true;
            }
            observable.next(true);
            observable.complete();
          }
        );
    }
    return observable;
  }

  singleEmbedUrlCreated(event: string) {
    this.embedUrl = event;
    this.iframeUrl = this.generateIframeUrl(this.embedUrl);
    this.embedLinkModal.show();
  }

  getEmbedLink() {
    return this.biteService.exportBitesToURL(this.biteList);
  }

  saveAsImage() {
    return this.biteService.exportBitesToURL(this.biteList);
  }


  doSaveAction(payload: SimpleDropdownPayload) {
    // this.logger.log(action + ' - ' +
    //   this.biteService.exportBitesToURL(this.biteList));
    if (payload.name === 'embed') {
      this.embedUrl = this.biteService.exportBitesToURL(this.biteList);
      this.iframeUrl = this.generateIframeUrl(this.embedUrl);
      this.embedLinkModal.show();
      this.analyticsService.trackEmbed();
    } else if (payload.name === 'image') {
      this.biteService.saveAsImage(this.biteList);
      this.analyticsService.trackSaveImage();
    } else if (payload.name === 'save-views') {
      const biteListToSave = this.resetMode ? [] : this.biteList;
      this.biteService.saveBites(biteListToSave).subscribe(
        (successful: boolean) => {
          this.logger.log('Result of bites saved: ' + successful);
          this.savedModalMessage = 'Your configuration was saved on the server !';
          this.savedModal.show();
        },
        error => {
          this.logger.error('Save failed: ' + error);
          this.savedModalMessage = 'FAILED: Saving configuration failed. Please try again!';
        }
      );
    } else if (payload.name === 'show-recipe-section') {
      this.showCookbookControls = payload.checked;
    }
  }

  generateIframeUrl(src: string) {
    const result = '<iframe  src="' + src + '" style="border:none; width:100%; min-height:500px"></iframe>';
    return result;
  }
}
