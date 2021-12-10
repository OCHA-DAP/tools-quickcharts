// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  hxlProxy: window['env']['hxlProxy'] || 'https://dev.data-humdata-org.ahconu.org/hxlproxy/data.json',
  maxBites: window['env']['maxBites'] || 6,
  snapService: window['env']['snapService'] || 'https://dev.data-humdata-org.ahconu.org/snap',
  googleAnalyticsKey: window['env']['googleAnalyticsKey'] || 'UA-48221887-3',
  prodMixpanelKey: window['env']['prodMixpanelKey'] || '99035923ee0a67880e6c05ab92b6cbc0', // actually hdx-server project not prod
  testMixpanelKey: window['env']['testMixpanelKey'] || '875bfe50f9cb981f4e2817832c83c165',
  // used by analytics code to decide which key to use
  prodHostnames: window['env']['prodHostnames'] || ['data.humdata.org'],
  recipeUrl: window['env']['recipeUrl'] || 'https://raw.githubusercontent.com/OCHA-DAP/hxl-recipes/1.0.11/cookbook-library.json'
};
