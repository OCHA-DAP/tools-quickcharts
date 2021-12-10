export const environment = {
  production: true,
  hxlProxy: window['env']['hxlProxy'] || '/hxlproxy/data.json',
  maxBites: window['env']['maxBites'] || 6,
  snapService: window['env']['snapService'] || 'https://data.humdata.org/snap',
  googleAnalyticsKey: window['env']['googleAnalyticsKey'] || 'UA-48221887-3',
  prodMixpanelKey: window['env']['prodMixpanelKey'] || '5cbf12bc9984628fb2c55a49daf32e74',
  testMixpanelKey: window['env']['testMixpanelKey'] || '99035923ee0a67880e6c05ab92b6cbc0',
  // used by analytics code to decide which key to use
  prodHostnames: window['env']['prodHostnames'] || ['data.humdata.org'],
  recipeUrl: window['env']['recipeUrl'] || 'https://raw.githubusercontent.com/OCHA-DAP/hxl-recipes/1.0.11/cookbook-library.json'
};
