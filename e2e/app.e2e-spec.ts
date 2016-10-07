import { HxlBitesPage } from './app.po';

describe('hxl-bites App', function() {
  let page: HxlBitesPage;

  beforeEach(() => {
    page = new HxlBitesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
