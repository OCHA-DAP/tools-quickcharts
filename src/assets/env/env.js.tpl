(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["hxlProxy"] = ${HXL_PROXY};
  window["env"]["snapService"] = ${SNAP_SERVICE};
  //window["env"]["googleAnalyticsKey"] = ${GOOGLE_ANALYTICS_KEY};
  window["env"]["prodMixpanelKey"] = ${PROD_MIXPANEL_KEY};
  window["env"]["testMixpanelKey"] = ${TEST_MIXPANEL_KEY};
  window["env"]["prodHostnames"] = ${PROD_HOSTNAMES};
  window["env"]["recipeUrl"] = ${RECIPE_URL};
})(this);
