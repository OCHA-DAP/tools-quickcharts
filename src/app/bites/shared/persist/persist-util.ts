import { HxlPreviewConfig } from './hxl-preview-config';
import { Bite } from '../../bite/types/bite';
import { Logger } from 'angular2-logger/core';

export class PersisUtil {

  readonly CONFIG_VERSION = 2;

  constructor(private logger: Logger){}

  /**
   * Transforms a bitelist to a config string that can be saved.
   * Adds metadata (like version) and JSONifies.
   * @param bitelist
   */
  public bitelistToConfig(bitelist: Bite[]): string {
    const config: HxlPreviewConfig = {
      configVersion: this.CONFIG_VERSION,
      bites: bitelist
    };
    return JSON.stringify(config);
  }

  public configToBitelist(config: string): Bite[] {
    const configObj: HxlPreviewConfig = JSON.parse(config);
    if (configObj.configVersion === this.CONFIG_VERSION){
      return configObj.bites;
    } else {
      this.logger.warn('Found config doesn\'t have correct version');
    }
    return [];
  }
}
