import { Cookbook } from './bite-config';
import { Ingredients } from './ingredients';

/**
 * Represents 1 loaded HXL Recipe
 */
/**
 * BiteConfig == Recipe
 */
 export interface BiteConfig {
  name: string;
  title: string;
  description: string;
  type: string;
  ingredients: Ingredients;
}

export interface Cookbook {
  name?: string;
  title: string;
  type: string;
  columns?: string[];
  recipes: BiteConfig[];
  selected?: boolean;
  /**
   * This is used in a cookbook library. This cookbook will be chosen in case none match.
   */
  default?: boolean;
}

export interface CookbookLibrary {
  name?: string;
  title?: string;
  type: string;
  cookbooks: Cookbook[];
}
