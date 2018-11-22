"use strict";
/* tslint:disable:no-unused-variable */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_service_1 = require("./analytics.service");
var core_1 = require("angular2-logger/core");
var app_config_service_1 = require("../../shared/app-config.service");
describe('Service: Analytics', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [analytics_service_1.AnalyticsService, core_1.Logger, app_config_service_1.AppConfigService]
        });
    });
    it('should ...', testing_1.inject([analytics_service_1.AnalyticsService], function (service) {
        expect(service).toBeTruthy();
    }));
    it('should use correct tokens', testing_1.inject([analytics_service_1.AnalyticsService, app_config_service_1.AppConfigService], function (service, configService) {
        configService.init({
            googleAnalyticsKey: 'ga-token',
            prodMixpanelKey: 'mp-prod-token',
            testMixpanelKey: 'mp-test-token',
            prodHostname: 'data.humdata.org'
        });
        service.init();
        expect(service.mpToken).toBe('mp-test-token');
        configService.init({
            googleAnalyticsKey: 'ga-token',
            prodMixpanelKey: 'mp-prod-token',
            testMixpanelKey: 'mp-test-token',
            prodHostname: 'localhost'
        });
        service.init();
        expect(service.mpToken).toBe('mp-prod-token');
    }));
});
//# sourceMappingURL=analytics.service.spec.js.map