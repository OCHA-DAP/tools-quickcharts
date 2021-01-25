import { Injectable } from '@angular/core';
import { Bite, BiteConfig, BiteLogicFactory, ChartBite, ChartBiteLogic, ComparisonChartBite, CookbooksAndTags,
  CookBookService, TimeseriesChartBite } from 'hxl-preview-ng-lib';
import { NGXLogger as Logger } from 'ngx-logger';
import { AsyncSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SimpleDropdownItem } from '../../common/component/simple-dropdown/simple-dropdown.component';
import { AppConfigService } from '../../shared/app-config.service';
import { DomEventsService } from '../../shared/dom-events.service';
import { PersistService } from './persist.service';
import { HxlPreviewConfig } from './persist/hxl-preview-config';
import { PersisUtil } from './persist/persist-util';
import { RecipeService } from './recipe.service';

@Injectable()
export class BiteService {
  public static CHART_SETTINGS_PARAM = ';chartSettings=';
  public static CHART_SHARE_PARAM = ';chartShare=';

  public quickChartsTitle = 'Quick Charts';
  public url: string;
  private nextId = 0;

  private persistUtil: PersisUtil;

  private readonly filterErrorMessagesFromSavedBites = map((hxlPreviewConfig: HxlPreviewConfig) => {
    if (hxlPreviewConfig && hxlPreviewConfig.bites) {
      hxlPreviewConfig.bites.forEach((bite: Bite) => {
        bite.errorMsg = null;
      });
    }
    return hxlPreviewConfig;
  });

  private static findBiteInArray(bite: Bite, bites: Bite[]): number {
    let index = -1;
    for (let i = 0; i < bites.length; i++) {
      if (bite === bites[i]) {
        index = i;
      }
    }
    return index;
  }

  constructor(private recipeService: RecipeService, private cookBookService: CookBookService,
              private logger: Logger, private persistService: PersistService,
              private appConfigService: AppConfigService, private domEventService: DomEventsService) {
    this.persistUtil = new PersisUtil(logger);
  }

  public init() {
    this.url = this.appConfigService.get('url');
    const title = this.appConfigService.get('embeddedTitle');
    if (title) {
      this.quickChartsTitle = title;
    }
  }

  public getNextId(): number {
    this.nextId = this.nextId + 1;
    return this.nextId;
  }

  public loadSavedPreview(resetMode: boolean): Observable<HxlPreviewConfig> {
    return this.retrieveSavedPreview(resetMode).pipe(
      this.filterErrorMessagesFromSavedBites
    )
  }

  private retrieveSavedPreview(resetMode: boolean): Observable<HxlPreviewConfig> {
    if (resetMode) {
      return of({
        configVersion: 0,
        bites: []
      });
    }

    const embeddedConfig = this.appConfigService.get('embeddedConfig');
    if (embeddedConfig && embeddedConfig.length) {
      return of(this.persistUtil.configToBitelist(embeddedConfig));
    } else {
      return this.persistService.load();
    }
  }

  saveBites(biteList: Bite[], cookbookUrl: string, chosenCookbookName: string,
        resetMode: boolean): Observable<boolean> {
    if (!resetMode) {
      const modifiedBiteList = this.unpopulateListOfBites(biteList);
      return this.persistService.save(modifiedBiteList, cookbookUrl, chosenCookbookName);
    } else {
      return this.persistService.save([]);
    }
  }

  private filterPathWithoutParams(path: string): string {
    if (path) {
      const index = path.indexOf(';');
      return path.slice(0, index);
    }
    return '';
  }

  saveAsImage(biteList: Bite[], customCookbookUrl: string, chosenCookbookName: string, isSingleWidgetMode: boolean ) {
    const snapService = environment.snapService;
    let url = this.exportBitesToURL(biteList, customCookbookUrl, chosenCookbookName, isSingleWidgetMode);
    url += BiteService.CHART_SETTINGS_PARAM + false + BiteService.CHART_SHARE_PARAM + false;
    const urlEncoded = encodeURIComponent(url);
    const viewPortWidth = isSingleWidgetMode ? 500 : 1280;
    const pngDownloadUrl = `${snapService}?delay=5000&output=png&width=${viewPortWidth}&height=1&url=${urlEncoded}`;

    setTimeout(() => {
      window.open(pngDownloadUrl, '_blank');
    }, 2);
  }

  exportBitesToURL(biteList: Bite[], customCookbookUrl: string, chosenCookbookName: string,
    isSingleWidgetMode: boolean): string {
    biteList = biteList ? biteList : [];

    const protocol = this.appConfigService.get('loc_protocol');
    const hostname = this.appConfigService.get('loc_hostname');
    let port = this.appConfigService.get('loc_port');
    const path = this.appConfigService.get('loc_pathname');

    const modifiedBiteList = this.unpopulateListOfBites(biteList);
    let embeddedConfig = encodeURIComponent(this.persistUtil.bitelistToConfig(modifiedBiteList,
              customCookbookUrl, chosenCookbookName));

    /* Dealing with parenthesis which are not encoded by encodeURIComponent */
    embeddedConfig = embeddedConfig.replace(/\(/g, '%28').replace(/\)/g, '%29');

    const url = encodeURIComponent(this.appConfigService.get('url'));
    const pathWithoutParams = this.filterPathWithoutParams(path);

    const singleWidgetMode = isSingleWidgetMode ? ';singleWidgetMode=true' : '';

    port = port ? ':' + port : '';

    const embeddedSource = encodeURIComponent(this.appConfigService.get('embeddedSource'));
    const embeddedUrl = encodeURIComponent(this.appConfigService.get('embeddedUrl'));
    const embeddedDate = encodeURIComponent(this.appConfigService.get('embeddedDate'));
    const embeddedTitle = encodeURIComponent(this.quickChartsTitle);

    const httpRecipeUrl = this.appConfigService.get('recipeUrl');
    const recipeUrlParam = httpRecipeUrl ? `;recipeUrl=${encodeURIComponent(httpRecipeUrl)}` : '';

    let sample = '';
    const sampleConfig = this.appConfigService.get('sample');
    if (sampleConfig === 'true') {
      sample = ';sample=true';
    } else if (sampleConfig === 'false') {
      sample = ';sample=false';
    }

    const allowBiteSwitch = this.appConfigService.get('allowBiteSwitchInExport') === 'false' ?
            ';allowBiteSwitch=false' : '';

    const externalColorPattern = this.appConfigService.get('externalColorPattern') ?
      ';externalColorPattern=' + encodeURIComponent(this.appConfigService.get('externalColorPattern')) : '';

    const allowCustomColor = this.appConfigService.get('allowCustomColor') ?
      ';allowCustomColor=' + encodeURIComponent(this.appConfigService.get('allowCustomColor')) : '';

    const externalCss = this.appConfigService.get('externalCss') ?
          ';externalCss=' + encodeURIComponent(this.appConfigService.get('externalCss')) : '';

    const maxNumberOfValues = this.appConfigService.get('maxNumberOfValues') ?
    ';maxNumberOfValues=' + encodeURIComponent(this.appConfigService.get('maxNumberOfValues')) : '';

    return `${protocol}//${hostname}${port}${pathWithoutParams};` +
           `url=${url};embeddedSource=${embeddedSource};embeddedUrl=${embeddedUrl};embeddedDate=${embeddedDate};` +
           `embeddedConfig=${embeddedConfig}${singleWidgetMode};embeddedTitle=${embeddedTitle}` +
           `${recipeUrlParam}${sample}${allowBiteSwitch}${externalColorPattern}${allowCustomColor}${externalCss}` +
           `${maxNumberOfValues}`;
  }

  /**
   *
   * @param biteList
   * @return {Bite[]} A new list with cloned object. The fields that were populated from the source data will be emptied.
   */
  private unpopulateListOfBites(biteList: Bite[]): Bite[] {
    biteList.forEach(b => b.tempShowSaveCancelButtons = false);

    /* Do not modify the original bites by cloning them */
    const modifiedBiteList: Bite[] = this.cloneObjectLiteral(biteList) as Bite[];
    modifiedBiteList.forEach(bite => BiteLogicFactory.createBiteLogic(bite).unpopulateBite());
    return modifiedBiteList;
  }

  public cloneObjectLiteral<T>(obj: T): T {
    /* Hack to clone an object */
    return JSON.parse(JSON.stringify(obj));
  }

  public generateAvailableCookbooksAndBites(recipeUrl?: string, chosenCookbookName?: string):
            { biteObs: Observable<Bite>, cookbookAndTagsObs: Observable<CookbooksAndTags> } {

    const finalRecipeUrl = recipeUrl ? recipeUrl : this.appConfigService.get('recipeUrl');
    console.log('Recipe url is:' + finalRecipeUrl);
    return this.cookBookService.load(this.url, finalRecipeUrl, chosenCookbookName);
  }

  public genereateAvailableBites(columnNames: string[], hxlTags: string[], recipes: BiteConfig[]): Observable<Bite> {
    return this.cookBookService.determineAvailableBites(columnNames, hxlTags, recipes);
  }

  initBite(bite: Bite): Observable<Bite> {
    return this.recipeService.myProcessBite(bite, this.url);
  }

  resetBites() {
    this.domEventService.sendCancelledEvent();
  }

  resetBite(bite: Bite): Bite {
    return this.recipeService.resetBite(bite);
  }

  addBite(bite: Bite, bites: Bite[], replaceIndex?: number): Observable<boolean> {

    // /* Removing bite from list of available bites */
    // const index = BiteService.findBiteInArray(bite, availableBites);
    // availableBites.splice(index, 1);
    const observable = new AsyncSubject<boolean>();

    const clonedBite = this.cloneObjectLiteral(bite) as Bite;

    this.initBite(clonedBite)
      .subscribe(
        b => {
          if (b.type === ChartBite.type() || b.type === ComparisonChartBite.type() ||
                  b.type === TimeseriesChartBite.type()) {
            const chartBiteLogic = BiteLogicFactory.createBiteLogic(b) as ChartBiteLogic;
            // should we check if bite can render?
            if (replaceIndex === undefined) {
              // check if bite can render
              if (!chartBiteLogic.hasData()) {
                observable.next(false);
                observable.complete();
                return;
              }
            }
          }

          if (replaceIndex == null) {
            bites.push(b);
          } else {
            // Since there is a replace index it means that we're switching an existing bite
            // so we need to allow the user to save the change
            b.tempShowSaveCancelButtons = true;
            bites[replaceIndex] = b;
          }
          observable.next(true);
          observable.complete();
        },
        err => {
          this.logger.error('Can\'t process bite due to:' + err);
          // availableBites.push(bite);
          observable.next(false);
          observable.complete();
        }
      );
    return observable;
  }

  /**
   *
   * @param oldBite bite to be removed from bites list and added to availableBites
   * @param newBite bite to be added to bites list and removed from availableBites
   * @param bites
   * @param availableBites
   */
  switchBites(oldBite: Bite, newBite: Bite, bites: Bite[]) {
    if (bites) {
      const index: number = BiteService.findBiteInArray(oldBite, bites);
      if (index >= 0) {
        // BiteLogicFactory.createBiteLogic(oldBite).unpopulateBite();
        // availableBites.push(oldBite);
        this.addBite(newBite, bites, index);
      }
    }
  }

  generateBiteSelectionMenu(availableBites: Bite[]): SimpleDropdownItem[] {
    const categoryListMap: {[key: string]: SimpleDropdownItem[]} = {};
    if (availableBites) {
      for (let i = 0; i < availableBites.length; i++) {
        const b = availableBites[i];
        const biteLogic = BiteLogicFactory.createBiteLogic(b);

        let categoryList: SimpleDropdownItem[] = categoryListMap[b.displayCategory];
        /* Initializing category list */
        if (!categoryList) {
          categoryList = [
            {
              displayValue: b.displayCategory,
              type: 'header',
              payload: null
            }
          ];
          categoryListMap[b.displayCategory] = categoryList;
        }
        categoryList.push({
          displayValue: biteLogic.title,
          type: 'menuitem',
          payload: b
        });
      }

      /* Add dividers */
      for (const key in categoryListMap) {
        if (categoryListMap.hasOwnProperty(key)) {
          const categoryList = categoryListMap[key];
          categoryList.push({
            displayValue: null,
            type: 'divider',
            payload: null
          });
        }
      }

    }

    /* Concatenate all menu items into one list */
    let result: SimpleDropdownItem[] = [];
    for (const key in categoryListMap) {
      if (categoryListMap.hasOwnProperty(key)) {
        result = result.concat(categoryListMap[key]);
      }
    }

    /* No need for separator at the end */
    result.pop();

    return result;
  }

  getPoweredByDisplay(): Boolean {
    const embeddedConfig = this.appConfigService.get('embeddedConfig');
    if (embeddedConfig && embeddedConfig.length) {
      return true;
    } else {
      return false;
    }
  }

  getPoweredBySource(): String {
    return decodeURIComponent(this.appConfigService.get('embeddedSource'));
  }
  getPoweredByUrl(): String {
    return this.appConfigService.get('embeddedUrl');
  }
  getPoweredByDate(): String {
    return decodeURIComponent(this.appConfigService.get('embeddedDate'));
  }
}
