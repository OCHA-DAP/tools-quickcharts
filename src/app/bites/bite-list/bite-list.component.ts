import { SimpleDropdownPayload } from './../../common/component/simple-dropdown/simple-dropdown.component';
import { Bite, ChartBite, KeyFigureBite, TimeseriesChartBite, ComparisonChartBite, CookbooksAndTags } from 'hxl-preview-ng-lib';
import { Component, ElementRef, HostListener, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import {SortablejsOptions} from 'angular-sortablejs';
import {BiteService} from '../shared/bite.service';
import {Logger} from 'angular2-logger/core';
import {AppConfigService} from '../../shared/app-config.service';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { SimpleModalComponent } from 'hxl-preview-ng-lib';
import { Observable } from 'rxjs/Observable';
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
  bitesUnrendered = 0;
  availableBites: Array<Bite>;

  listIsFull: boolean;

  hxlUnsupported: boolean;
  spinnerActive = false;
  resetMode = false;

  adminChartsMenu: SimpleDropdownItem[];
  shareChartsMenu: SimpleDropdownItem[];

  sortableMain: SortablejsOptions = {
    handle: '.drag-handle',
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true
  };

  protected originalBitesBackup: Bite[];

  protected showCookbookControls = false;
  protected showCustomCookbookControls = false;
  protected customCookbookUrl = '';
  protected cookbooksAndTags: CookbooksAndTags;

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
  allowShare = true;
  allowSettings = true;

  /* share Widget configs */
  private shareUrlMode = false;
  shareAllowSettings = true;
  shareAllowShare = true;

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
    // console.log('Unknown message: ' + $event.data);
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

    this.shareChartsMenu = [
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
      }
    ];

  }

  ngOnInit() {
    this.init();
    this.adminChartsMenu = [
      {
        displayValue: 'ADMIN SETTINGS',
        type: 'header',
        payload: null
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
    if (this.hasModifyPermission()) {
      this.adminChartsMenu.splice(1, 0,
        {
          displayValue: 'Save the current views as default',
          type: 'menuitem',
          payload: {
            name: 'save-views'
          }
        }
      );
    }

    this.singleWidgetMode = this.appConfig.get('singleWidgetMode') === 'true';
    this.toolsMode = this.appConfig.get('toolsMode') === 'true';
    const chartSettings = this.appConfig.get('chartSettings');
    this.allowSettings = chartSettings !== 'false';
    const chartShare = this.appConfig.get('chartShare');
    this.allowShare = chartShare !== 'false';
  }

  protected hasModifyPermission (): boolean {
    return this.appConfig.get('has_modify_permission') === 'true';
  }

  private removeLoadedBiteToList(bite: Bite): void {
    this.biteList = this.biteList.filter(b => b !== bite);
    if (this.biteList.length <= +this.appConfig.get('maxBites')) {
      this.listIsFull = false;
    }
  }

  /**
   *  loads 3 bites as default when no other bites are saved
   */
  private loadDefaultBites() {

    this.bitesUnrendered = 0;
    // splitting the bites by their type
    const listA = this.availableBites.filter(bite => bite.type === ChartBite.type() || bite.type === ComparisonChartBite.type());
    const listB = this.availableBites.filter(bite => bite.type === KeyFigureBite.type());
    const listC = this.availableBites.filter(bite => bite.type === TimeseriesChartBite.type());
    const handleValue = (value, observer) => {
      if (!value) {
        // we have exhausted all available bites, send event into analytics
        this.analyticsService.trackNoMoreBitesToRender();
        this.bitesUnrendered++;
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

    const processBite = (idx) => {
      const instance = (bite) => {
        if (!bite) {
          return;
        }
        this.addBite(bite).subscribe((val) => {
          if (!val) {
            observable[idx].subscribe(instance);
          } else {
            // We choose a correct bite so we need to save the original config as backup
            this.originalBitesBackup = this.biteService.cloneObjectLiteral(this.biteList);
          }
        });
      };
      return instance;
    };
    observable[0].subscribe(processBite(0));
    observable[1].subscribe(processBite(1));
    observable[2].subscribe(processBite(2));
  }

  init() {
    this.availableBites = null;
    this.biteList = [];
    this.originalBitesBackup = [];
    this.biteService.loadSavedPreview(this.resetMode).subscribe(hxlPreviewConfig => {

      if (hxlPreviewConfig.recipeUrl) {
        this.showCustomCookbookControls = true;
        this.customCookbookUrl = hxlPreviewConfig.recipeUrl;
      }
      const availableInfo = this.biteService.generateAvailableCookbooksAndBites(hxlPreviewConfig.recipeUrl,
                          hxlPreviewConfig.cookbookName);
      if (hxlPreviewConfig.bites && hxlPreviewConfig.bites.length > 0) {
        hxlPreviewConfig.bites.forEach( b => {
          this.biteService.initBite(b).subscribe( bite => {
            this.biteList.push(bite);
            // Keep a copy of the loaded configuration to be able to revert to it
            const backupBite = this.biteService.cloneObjectLiteral(bite);
            this.originalBitesBackup.push(backupBite);
          });
        });
        // We have saved bites that were populated above, so we don't need to do anything once the
        // available bites are calculated -> callback is null
        this.generateAvailableBites(availableInfo.biteObs, null);
      } else {
        this.generateAvailableBites(availableInfo.biteObs, this.loadDefaultBites);
      }

      // If we are loading saved bites with a saved recipe, we don't prepare the HDX cookbook controls.
      // This will be populated in the changeCustomCookbookControls() method
      if (!this.showCustomCookbookControls) {
        availableInfo.cookbookAndTagsObs.subscribe(cookbookAndTags => {
          this.cookbooksAndTags = cookbookAndTags;
        });
      }
    });
  }

  copyToClipboard() {
    this.embedLinkInput.nativeElement.select();
    this.dom.execCommand('copy');
  }

  addBite(bite: Bite): Observable<boolean> {
    return this.biteService.addBite(bite, this.biteList);
  }

  deleteBite(bite: Bite) {
    this.removeLoadedBiteToList(bite);
    this.availableBites.push(this.biteService.resetBite(bite));
  }

  switchBite(bitePair: { oldBite: Bite, newBite: Bite }) {
    this.biteService.switchBites(bitePair.oldBite, bitePair.newBite, this.biteList);
  }

  cancelBite(biteIndex: number) {
    const newBite = this.biteService.cloneObjectLiteral(
                    this.originalBitesBackup[biteIndex]);
    this.biteList.splice(biteIndex, 1, newBite);
  }

  /**
   * This method makes sure only the bite on which "save" was clicked gets its changes saved.
   * The other bites in the list are taken from the "backup"
   *
   * @param biteIndex the index of the bite we want to save
   */
  saveBite(biteIndex: number) {
    const clonedBiteList = this.biteService.cloneObjectLiteral(this.biteList);
    for (let i = 0; i < clonedBiteList.length; i++) {
      if (i !== biteIndex) {
        const originalBite = this.biteService.cloneObjectLiteral(this.originalBitesBackup[i]);
        clonedBiteList[i] = originalBite;
      }
    }
    this.saveBitesToServer(clonedBiteList);
  }

  private getChosenCookbookName(): string {
    return this.cookbooksAndTags && this.cookbooksAndTags.chosenCookbook ?
                this.cookbooksAndTags.chosenCookbook.name : null;
  }

  private getCustomCookbookURL(): string {
    return this.showCustomCookbookControls ? this.customCookbookUrl : null;
  }

  private saveBitesToServer(biteList: Bite[]) {
    this.biteService.saveBites(biteList, this.getCustomCookbookURL(), this.getChosenCookbookName(),
          this.resetMode).subscribe(

        (successful: boolean) => {
          this.logger.log('Result of bites saved: ' + successful);
          this.savedModalMessage = 'Your configuration was saved on the server !';
          this.savedModal.show();
          this.originalBitesBackup = this.biteService.cloneObjectLiteral(biteList);
        },
        error => {
          this.logger.error('Save failed: ' + error);
          this.savedModalMessage = 'FAILED: Saving configuration failed. Please try again!';
        }
      );
  }

  generateAvailableBites(biteObs: Observable<Bite>, onCompleteCallback: () => void) {
    const newAvailableBites = [];
    // const loadedHashCodeList: number[] = this.biteList ? this.biteList.map(bite => bite.hashCode) : [];
    biteObs
      .subscribe(
      bite => {
        // this.logger.log('Available bite ' + JSON.stringify(bite));
        newAvailableBites.push(bite);
      },
      errObj => {
        this.logger.log('in ERROR...');
      },
      () => {
        this.logger.log('on COMPLETE...');
        this.availableBites = newAvailableBites;
        if (this.availableBites && this.biteList && this.availableBites.length === 0 && this.biteList.length === 0) {
          // Your files contains HXL tags which are not supported by Quick Charts
          this.hxlUnsupported = true;
        }
        if (onCompleteCallback) {
          onCompleteCallback.bind(this)();
        }
      }
      );
  }

  singleEmbedUrlCreated(event: string) {
    this.embedUrl = event;
    this.iframeUrl = this.generateIframeUrl(this.embedUrl);
    this.embedLinkModal.show();
  }

  getEmbedLink() {
    const customCookbookURL = this.showCustomCookbookControls ? this.customCookbookUrl : null;
    return this.biteService.exportBitesToURL(this.biteList, customCookbookURL,
              this.getChosenCookbookName(), false);
  }

  saveAsImage() {
    const customCookbookURL = this.showCustomCookbookControls ? this.customCookbookUrl : null;
    return this.biteService.exportBitesToURL(this.biteList, customCookbookURL,
              this.getChosenCookbookName(), false);
  }


  doSaveAction(payload: SimpleDropdownPayload) {

    if (payload.name === 'embed') {
      this.embedUrl = this.biteService.exportBitesToURL(this.biteList, this.getCustomCookbookURL(),
                    this.getChosenCookbookName(), false);
      this.iframeUrl = this.generateIframeUrl(this.embedUrl);
      this.embedLinkModal.show();
      this.analyticsService.trackEmbed();
    } else if (payload.name === 'image') {
      this.biteService.saveAsImage(this.biteList, this.getCustomCookbookURL(),
                    this.getChosenCookbookName(), false);
      this.analyticsService.trackSaveImage();
    } else if (payload.name === 'save-views') {
      const biteListToSave = this.resetMode ? [] : this.biteList;
      this.saveBitesToServer(biteListToSave);

    } else if (payload.name === 'show-recipe-section') {
      this.showCookbookControls = payload.checked;
      setTimeout(() => {
        const scrollHeight = window.document.body.scrollHeight;
        window.parent.postMessage(`iframeHeightUpdate:${scrollHeight}`, '*');
      }, 50);
    }
  }

  generateIframeUrl(src: string) {
    const result = '<iframe  src="' + src + '" style="border:none; width:100%; min-height:500px"></iframe>';
    return result;
  }

  protected changeCustomCookbookControls(show: boolean) {
    this.showCustomCookbookControls = show;
    if (!this.showCustomCookbookControls && !this.cookbooksAndTags) {
      this.biteList = [];
      const availableInfo = this.biteService.generateAvailableCookbooksAndBites();
      this.generateAvailableBites(availableInfo.biteObs, this.loadDefaultBites);
      availableInfo.cookbookAndTagsObs.subscribe(cookbookAndTags => {
        this.cookbooksAndTags = cookbookAndTags;
      });
    } else if (!this.showCustomCookbookControls) {
      let currentlySelected = 0;
      this.cookbooksAndTags.cookbooks.forEach( (cb, i) => {
        if (cb.selected) {
          currentlySelected = i;
        }
      });
      this.cookbookSelected(currentlySelected);
    } else if (this.showCustomCookbookControls && this.customCookbookUrl ) {
      this.customCookbookSelected(this.customCookbookUrl);
    }
  }

  protected cookbookSelected(index: number) {
    this.cookbooksAndTags.chosenCookbook.selected = false;
    this.cookbooksAndTags.cookbooks[index].selected = true;
    this.cookbooksAndTags.chosenCookbook = this.cookbooksAndTags.cookbooks[index];

    this.biteList = [];
    const biteObs = this.biteService.genereateAvailableBites(this.cookbooksAndTags.columnNames,
                        this.cookbooksAndTags.hxlTags, this.cookbooksAndTags.chosenCookbook.recipes);

    this.generateAvailableBites(biteObs, this.loadDefaultBites);
  }

  protected customCookbookSelected(url: string) {
    console.log(url);
    this.customCookbookUrl = url;
    this.biteList = [];
    const availableInfo = this.biteService.generateAvailableCookbooksAndBites(url);
    this.generateAvailableBites(availableInfo.biteObs, this.loadDefaultBites);
  }

  public changeShareMode() {
    this.shareUrlMode = !this.shareUrlMode;
  }

  // extended embed url + sharing controls
  public get fullEmbedUrl(): string {
    return this.embedUrl + ';chartSettings=' + this.shareAllowSettings + ';chartShare=' + this.shareAllowShare;
  }
  // extended embed url + sharing controls
  public get fullIframeUrl(): string {
    return this.generateIframeUrl(this.fullEmbedUrl);
  }

}
