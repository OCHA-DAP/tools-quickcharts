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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var hxl_operations_1 = require("./hxlproxy-transformers/hxl-operations");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var sum_chart_transformer_1 = require("./hxlproxy-transformers/sum-chart-transformer");
var bite_logic_factory_1 = require("../types/bite-logic-factory");
var count_chart_transformer_1 = require("./hxlproxy-transformers/count-chart-transformer");
var distinct_count_chart_transformer_1 = require("./hxlproxy-transformers/distinct-count-chart-transformer");
var timeseries_chart_transformer_1 = require("./hxlproxy-transformers/timeseries-chart-transformer");
var filter_setting_transformer_1 = require("./hxlproxy-transformers/filter-setting-transformer");
var mylog_service_1 = require("./mylog.service");
require("rxjs/Rx");
var HxlproxyService = /** @class */ (function () {
    function HxlproxyService(logger, httpClient) {
        this.logger = logger;
        this.httpClient = httpClient;
        this.config = {};
        this.specialFilterValues = {};
    }
    // constructor(private logger: Logger, private http: Http) {
    // let observable = this.getMetaRows('https://test-data.humdata.org/dataset/' +
    //   '8b154975-4871-4634-b540-f6c77972f538/resource/3630d818-344b-4bee-b5b0-6ddcfdc28fc8/download/eed.csv');
    // observable.subscribe( this.testResponse.bind(this) );
    // this.getDataForBite({type: 'chart', groupByTags: ['#adm1+name', '#adm1+code'], valueTag: '#affected+buildings+partially'});
    // }
    HxlproxyService.prototype.init = function (params) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                this.config[key] = params[key];
            }
        }
    };
    HxlproxyService.prototype.fetchMetaRows = function (hxlFileUrl) {
        this.hxlFileUrl = hxlFileUrl;
        var myObservable;
        if (this.metaRows && !this.config['noCachedMetarows']) {
            this.logger.log('Using cached metarows');
            var mySubject = new rxjs_1.AsyncSubject();
            mySubject.next(this.metaRows);
            mySubject.complete();
            myObservable = mySubject;
        }
        else {
            myObservable = this.makeCallToHxlProxy([{ key: 'max-rows', value: '0' }], this.processMetaRowResponse);
        }
        return myObservable;
    };
    HxlproxyService.prototype.fetchFilterSpecialValues = function (filter) {
        var _this = this;
        var myObservable = new rxjs_1.AsyncSubject();
        var inputs = [];
        var availableSpecialValues = {
            '$MAX$': 'max',
            '$MIN$': 'min'
        };
        var createHxlProxyRecipes = (function (pair) {
            var column = Object.keys(pair)[0];
            var value = pair[column];
            if (Object.keys(availableSpecialValues).indexOf(value) >= 0) {
                var key = column + "-" + value;
                var aggFunction = availableSpecialValues[value];
                // If we haven't yet found the special value for this column (ex: max for #date+year) then get it now
                if (!_this.specialFilterValues[key]) {
                    var countRecipe = new hxl_operations_1.CountRecipe(['#fakeColumn'], [aggFunction + "(" + column + ")"]);
                    inputs.push({
                        recipes: JSON.stringify([countRecipe]),
                        key: key
                    });
                }
            }
        });
        if (filter) {
            (filter.filterWith || []).forEach(createHxlProxyRecipes);
            (filter.filterWithout || []).forEach(createHxlProxyRecipes);
        }
        var hxlProxyObservables = inputs.map(function (input) {
            return _this.makeCallToHxlProxy([{ key: 'recipe', value: input.recipes }], function (response) {
                var ret = response;
                // 2 header rows then comes the data, 1 fake column
                if (ret.length === 3 && ret[2].length > 1) {
                    var specialValue = ret[2][1];
                    _this.specialFilterValues[input.key] = specialValue;
                    return true;
                }
                else {
                    console.error('Didn\'t get filter special value from hxl proxy');
                    return false;
                }
            });
        });
        rxjs_1.forkJoin(hxlProxyObservables).subscribe(null, null, function () {
            myObservable.next(_this.specialFilterValues);
            myObservable.complete();
        });
        return myObservable;
    };
    HxlproxyService.prototype.populateBite = function (bite, hxlFileUrl) {
        var _this = this;
        return this.fetchMetaRows(hxlFileUrl)
            .pipe(operators_1.flatMap(function (metarows) {
            var biteLogic = bite_logic_factory_1.BiteLogicFactory.createBiteLogic(bite);
            var transformer;
            switch (bite.ingredient.aggregateFunction) {
                case 'count':
                    transformer = new count_chart_transformer_1.CountChartTransformer(biteLogic);
                    break;
                case 'sum':
                    transformer = new sum_chart_transformer_1.SumChartTransformer(biteLogic);
                    break;
                case 'distinct-count':
                    transformer = new distinct_count_chart_transformer_1.DistinctCountChartTransformer(biteLogic);
                    break;
            }
            if (biteLogic.usesDateColumn()) {
                transformer = new timeseries_chart_transformer_1.TimeseriesChartTransformer(transformer, biteLogic.dateColumn);
            }
            // if (bite.filteredValues && bite.filteredValues.length > 0) {
            //   transformer = new FilterSettingTransformer(transformer, bite.ingredient.valueColumn, bite.filteredValues);
            // }
            return _this.fetchFilterSpecialValues(bite.ingredient.filters)
                .pipe(operators_1.flatMap(function (specialFilterValues) {
                if (biteLogic.hasFilters()) {
                    transformer = new filter_setting_transformer_1.FilterSettingTransformer(transformer, bite.ingredient.filters, specialFilterValues);
                }
                var recipesStr = transformer.generateJsonFromRecipes();
                // this.logger.log(recipesStr);
                var responseToBiteMapping = function (response) {
                    return biteLogic.populateWithHxlProxyInfo(response, _this.tagToTitleMap).getBite();
                };
                var onErrorBiteProcessor = function () {
                    biteLogic.getBite().errorMsg = 'Error while retrieving data values';
                    return rxjs_1.of(biteLogic.getBite());
                };
                return _this.makeCallToHxlProxy([{ key: 'recipe', value: recipesStr }], responseToBiteMapping, onErrorBiteProcessor);
            }));
        }));
    };
    /**
     * Makes a call to the hxl proxy
     * @param params parameter pairs that will be sent to the HXL Proxy in the URL (the data src url should not be specified here)
     * @param mapFunction function that will map the result to some data structure
     * @param errorHandler error handling function
     */
    HxlproxyService.prototype.makeCallToHxlProxy = function (params, mapFunction, errorHandler) {
        // let myMapFunction: (response: Response) => T;
        // if (mapFunction) {
        //   myMapFunction = mapFunction;
        // } else {
        //   myMapFunction = (response: Response) => response.json();
        // }
        var _this = this;
        var url = this.config['hxlProxy'] + "?url=" + encodeURIComponent(this.hxlFileUrl);
        if (params) {
            for (var i = 0; i < params.length; i++) {
                url += '&' + params[i].key + '=' + encodeURIComponent(params[i].value);
            }
        }
        this.logger.log('The call will be made to: ' + url);
        return this.httpClient.get(url).pipe(operators_1.map(mapFunction.bind(this)), operators_1.catchError(function (err) { return _this.handleError(err, errorHandler); }));
    };
    HxlproxyService.prototype.processMetaRowResponse = function (response) {
        var ret = response;
        // let ret = [json[0], json[1]];
        this.logger.log('Response is: ' + ret);
        this.metaRows = ret;
        this.tagToTitleMap = {};
        if (ret.length === 2) {
            for (var i = 0; i < ret[1].length; i++) {
                this.tagToTitleMap[ret[1][i]] = ret[0][i];
            }
        }
        else {
            throw new Error('There should be 2 meta rows');
        }
        return ret;
    };
    // private testResponse(result) {
    //   this.logger.log('Test response is: ' + result);
    // }
    HxlproxyService.prototype.handleError = function (error, errorHandler) {
        var errMsg;
        // TODO: Response logic might need refactoring after switching to HttpClient in Angular 6
        if (error instanceof Response) {
            try {
                var body = error.json() || '';
                var err = body.error || JSON.stringify(body);
                errMsg = error.status + " - " + (error.statusText || '') + " " + err;
            }
            catch (e) {
                errMsg = e.toString();
            }
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('ERR! ' + errMsg);
        var retValue = errorHandler ? errorHandler() : rxjs_1.throwError(errMsg);
        return retValue;
    };
    HxlproxyService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [mylog_service_1.MyLogService, http_1.HttpClient])
    ], HxlproxyService);
    return HxlproxyService;
}());
exports.HxlproxyService = HxlproxyService;
//# sourceMappingURL=hxlproxy.service.js.map