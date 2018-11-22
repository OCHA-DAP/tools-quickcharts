"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var mylog_service_1 = require("./mylog.service");
exports.GA_PAGEVIEW = 'pageview';
exports.GA_EVENT = 'event';
/**
 * Service that will try to abstract sending the analytics events
 * to Google Analytics and Mixpanel, but do nothing if the libs are
 * not loaded
 */
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService(logger) {
        this.logger = logger;
        this.gaInitialised = false;
        this.mpInitialised = false;
    }
    AnalyticsService.prototype.init = function (gaKey, mpKey) {
        try {
            this.gaToken = gaKey;
            if (this.gaToken) {
                ga('create', this.gaToken, 'auto');
                this.gaInitialised = true;
            }
        }
        catch (err) {
            this.logger.info('Can\'t initialize Google Analytics: ' + err);
        }
        try {
            this.mpToken = mpKey;
            if (this.mpToken) {
                mixpanel.init(this.mpToken);
                this.mpInitialised = true;
            }
        }
        catch (err) {
            this.logger.info('Can\'t initialize Mixpanel: ' + err);
        }
    };
    AnalyticsService.prototype.isInitialized = function () {
        return this.gaInitialised && this.mpInitialised;
    };
    // public trackView() {
    //   const category = 'hxl preview';
    //   const {url, pageTitle} = this.extractPageInfo();
    //   const gaData = {
    //     type: 'pageview',
    //     category: category,
    //     action: 'view',
    //     label: pageTitle || ''
    //   };
    //   const mpData = {
    //     category: category,
    //     metadata: {
    //       url: url,
    //       pageTitle: pageTitle,
    //     }
    //   };
    //   this.send(gaData, mpData);
    // }
    AnalyticsService.prototype.extractPageInfo = function () {
        var url;
        var pageTitle;
        try {
            url = (window.location !== window.parent.location)
                ? document.referrer
                : document.location.href;
            pageTitle = window.parent ? window.parent.document.title : window.document.title;
        }
        catch (Exception) {
            /* we don't have access to the parent due to cross-origin */
            url = document.referrer;
            pageTitle = window.document.title;
            this.logger.log("in security error because of cross origin - url is " + url + " and pageTitle is " + pageTitle);
        }
        return { url: url, pageTitle: pageTitle };
    };
    // public trackSave() {
    //   this.trackEventCategory('hxl preview edit');
    // }
    AnalyticsService.prototype.trackEventCategory = function (category, additionalGaData, additionalMpData) {
        var _a = this.extractPageInfo(), url = _a.url, pageTitle = _a.pageTitle;
        additionalGaData = additionalGaData ? additionalGaData : {};
        var gaData = {
            type: additionalGaData.type || exports.GA_EVENT,
            category: additionalGaData.category || category,
            action: additionalGaData.action || null,
            label: additionalGaData.label || pageTitle || null,
            value: additionalGaData.value || null,
            dimensionInfo: additionalGaData.dimensionInfo
        };
        var mpData = {
            category: category,
            metadata: {
                'embedded in': url,
                'page title': pageTitle,
            }
        };
        if (additionalMpData) {
            Object.assign(mpData.metadata, additionalMpData);
        }
        this.send(gaData, mpData);
    };
    AnalyticsService.prototype.send = function (gaData, mpData) {
        // this.logger.info('Logging the event...');
        var gaDimensionInfo = null;
        if (gaData.dimensionInfo) {
            gaDimensionInfo = gaData.dimensionInfo;
        }
        if (this.gaInitialised) {
            // this.logger.info('    Google Analytics - ok');
            if (exports.GA_PAGEVIEW === gaData.type) {
                ga('send', 'pageview');
            }
            else {
                // ga('send', gaData.type, gaData.category, gaData.action, gaData.label, gaData.value, gaDimensionInfo);
                var sendData = Object.assign({
                    'hitType': gaData.type,
                    'eventCategory': gaData.category,
                    'eventAction': gaData.action,
                    'eventLabel': gaData.label,
                    'eventValue': gaData.value
                }, gaDimensionInfo);
                ga('send', sendData);
            }
        }
        if (this.mpInitialised) {
            // this.logger.info('    Mixpanel         - ok');
            mixpanel.track(mpData.category, mpData.metadata);
        }
    };
    AnalyticsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [mylog_service_1.MyLogService])
    ], AnalyticsService);
    return AnalyticsService;
}());
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map