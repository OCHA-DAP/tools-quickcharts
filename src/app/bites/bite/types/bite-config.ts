import { Ingredients } from './ingredients';

export interface BiteConfig {
  name: string;
  description: string;
  type: string;
  ingredients: Ingredients;
}
