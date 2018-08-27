import { HxlPreviewConfig } from './hxl-preview-config';
import { Bite, BiteLogicFactory } from 'hxl-preview-ng-lib';
import { Logger } from 'simple-angular-logger';

abstract class Patcher {

  constructor() {}

  public abstract patch(hxlPreviewConfig: HxlPreviewConfig);

  public abstract newConfigVersion(): number;

}

class From2To3Patcher extends Patcher {

  static readonly NEW_CONFIG_VERSION = 3;

  public newConfigVersion(): number {
    return From2To3Patcher.NEW_CONFIG_VERSION;
  }

  public patch(hxlPreviewConfig: HxlPreviewConfig) {
    if (hxlPreviewConfig.bites) {
      for (let i = 0; i < hxlPreviewConfig.bites.length; i++) {
        const bite = hxlPreviewConfig.bites[i];
        this.patchBite(bite);
      }
    }

    hxlPreviewConfig.configVersion = this.newConfigVersion();

    return hxlPreviewConfig;
  }

  private patchBite(bite: Bite) {
    const biteLogic = BiteLogicFactory.createBiteLogic(bite);
    if (!bite.uiProperties) {
      bite.uiProperties = biteLogic.initUIProperties();
    }
    if (!bite.computedProperties) {
      bite.computedProperties = biteLogic.initComputedProperties();
    }
    if (!bite.dataProperties) {
      bite.dataProperties = biteLogic.initDataProperties();
    }

    [
      'title', 'description', // general
      'showGrid', 'swapAxis', 'color', 'sorting', // charts
      'unit', 'preText', 'postText', 'numberFormat' // key figures
    ].forEach( property => {
      if (bite[property]) {
        bite.uiProperties[property] = bite[property];
        delete bite[property];
      }
    });

  }
}
export class PersisUtil {

  static readonly patchers: Patcher[] = [new From2To3Patcher()];

  readonly CONFIG_VERSION = 3;

  constructor(private logger: Logger) {}

  /**
   * Transforms a bitelist to a config string that can be saved.
   * Adds metadata (like version) and JSONifies.
   * @param bitelist
   */
  public bitelistToConfig(bitelist: Bite[], recipeUrl?: string, cookbookName?: string): string {
    const config: HxlPreviewConfig = {
      configVersion: this.CONFIG_VERSION,
      bites: bitelist
    };
    if (recipeUrl) {
      config['recipeUrl'] = recipeUrl;
    }
    if (cookbookName) {
      config['cookbookName'] = cookbookName;
    }
    return JSON.stringify(config);
  }

  public configToBitelist(config: string): HxlPreviewConfig {
    const configObj: HxlPreviewConfig = JSON.parse(config);
    if (configObj.configVersion < this.CONFIG_VERSION) {
      PersisUtil.patchers.forEach(patcher => {
        if (configObj.configVersion < patcher.newConfigVersion()) {
          patcher.patch(configObj);
        }
      });
    }

    if (configObj.configVersion === this.CONFIG_VERSION) {
      return configObj;
    } else {
      this.logger.warn('Found config doesn\'t have correct version');
    }
    return {
      configVersion: 0,
      bites: []
    };
  }
}
