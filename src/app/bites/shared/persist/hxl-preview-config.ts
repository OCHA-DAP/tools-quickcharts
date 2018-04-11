import { Bite } from 'hxl-preview-ng-lib';

export interface HxlPreviewConfig {
  configVersion: number;
  recipeUrl?: string;
  cookbookName?: string;
  bites: Bite[];
}
