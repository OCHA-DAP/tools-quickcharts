import { browser, element, by } from 'protractor';

export class HxlBitesPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('hxl-root h1')).getText();
  }
}
