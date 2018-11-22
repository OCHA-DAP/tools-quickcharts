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
var pattern_1 = require("../util/hxl/pattern");
var ingredient_1 = require("../types/ingredient");
var core_1 = require("@angular/core");
var hxlproxy_service_1 = require("./hxlproxy.service");
var chart_bite_1 = require("../types/chart-bite");
var key_figure_bite_1 = require("../types/key-figure-bite");
var comparison_chart_bite_1 = require("../types/comparison-chart-bite");
var bite_logic_factory_1 = require("../types/bite-logic-factory");
var timeseries_chart_bite_1 = require("../types/timeseries-chart-bite");
var mylog_service_1 = require("./mylog.service");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var CookBookService = /** @class */ (function () {
    // private cookBooks: string[];
    function CookBookService(logger, hxlproxyService, httpClient) {
        this.logger = logger;
        this.hxlproxyService = hxlproxyService;
        this.httpClient = httpClient;
        this.config = {};
        // this.cookBooks = [
        //   // 'assets/bites-chart.json',
        //   // 'assets/bites-key-figure.json',
        //   'https://raw.githubusercontent.com/OCHA-DAP/hxl-recipes/1.0.0/cookbook-library.json',
        // ];
    }
    CookBookService.prototype.hxlMatcher = function (generalColumn, dataColumn) {
        return pattern_1.Pattern.matchPatternToColumn(generalColumn, dataColumn);
    };
    CookBookService.prototype.matchInSet = function (dataColumn, recipeColumns) {
        var _this = this;
        return recipeColumns.filter(function (column) { return _this.hxlMatcher(column, dataColumn); }).length !== 0;
    };
    CookBookService.prototype.findColsForComparisonChart = function (recipeColumns, dataColumns) {
        var _this = this;
        var comparisonBiteInfoList = [];
        recipeColumns.forEach(function (recipeCol) {
            // comp_sections should be something like: [1st_value_hxltag, comparison_operator, 2nd_value_hxltag]
            var comp_sections = recipeCol.split(' ');
            if (comp_sections.length === 3) {
                var info_1 = new ComparisonBiteInfo(comp_sections[1]);
                dataColumns.forEach(function (dataCol) {
                    if (pattern_1.Pattern.matchPatternToColumn(comp_sections[0], dataCol)) {
                        info_1.valueCol = dataCol;
                    }
                    else if (pattern_1.Pattern.matchPatternToColumn(comp_sections[2], dataCol)) {
                        info_1.comparisonValueCol = dataCol;
                    }
                });
                if (info_1.isFilled()) {
                    comparisonBiteInfoList.push(info_1);
                }
            }
            else {
                _this.logger.error(recipeCol + " should have 3 parts");
            }
        });
        return comparisonBiteInfoList;
    };
    CookBookService.prototype.allCookbookPatternsMatch = function (hxlPatterns, hxlColumns) {
        for (var i = 0; i < hxlPatterns.length; i++) {
            var pattern = hxlPatterns[i];
            var matches = false;
            for (var j = 0; j < hxlColumns.length; j++) {
                var col = hxlColumns[j];
                if (pattern_1.Pattern.matchPatternToColumn(pattern, col)) {
                    matches = true;
                    break;
                }
            }
            if (!matches) {
                return false;
            }
        }
        ;
        return true;
    };
    CookBookService.prototype.determineCorrectCookbook = function (cookbooks, hxlColumns, chosenCookbookName) {
        var _this = this;
        var checkByName = function (cookbook) { return cookbook.name === chosenCookbookName; };
        var checkByPattern = function (cookbook) {
            var hxlPatterns = cookbook.columns || [];
            hxlColumns = hxlColumns || [];
            if (_this.allCookbookPatternsMatch(hxlPatterns, hxlColumns)) {
                return true;
            }
            return false;
        };
        var check = chosenCookbookName ? checkByName : checkByPattern;
        if (cookbooks && cookbooks.length > 0) {
            var selectedCookbook = cookbooks[0];
            // Setting default cookbook for the case when none will match
            for (var idx = 0; idx < cookbooks.length; idx++) {
                if (cookbooks[idx].default) {
                    selectedCookbook = cookbooks[idx];
                    break;
                }
            }
            var i = 0;
            for (i = 0; i < cookbooks.length; i++) {
                var cookbook = cookbooks[i];
                if (check(cookbook)) {
                    selectedCookbook = cookbooks[i];
                    break;
                }
            }
            selectedCookbook.selected = true;
            return selectedCookbook;
        }
        throw new Error('Cookbooks list is empty. Something went wrong !');
    };
    CookBookService.prototype.determineAvailableBites = function (columnNames, hxlTags, biteConfigs) {
        var _this = this;
        var bites = new rxjs_1.Observable(function (observer) {
            biteConfigs.forEach(function (biteConfig) {
                var aggregateColumns = [];
                var recipeColumns = biteConfig.ingredients.valueColumns;
                var dateColumns = [];
                var aggregateFunctions = biteConfig.ingredients.aggregateFunctions;
                if (!aggregateFunctions || aggregateFunctions.length === 0) {
                    aggregateFunctions = ['sum'];
                }
                var avAggCols = [];
                if (biteConfig.ingredients.aggregateColumns) {
                    biteConfig.ingredients.aggregateColumns.forEach(function (col) {
                        if (!(biteConfig.type === 'timeseries' && col.indexOf('#date') >= 0)) {
                            aggregateColumns.push(col);
                        }
                    });
                    // filter the available hxlTags, and not the recipe general tags
                    avAggCols = hxlTags.filter(function (col) { return _this.matchInSet(col, aggregateColumns); });
                    // avAggCols = aggregateColumns.filter(col => this.matchInSet(col, hxlTags));
                }
                var avValCols = [];
                var comparisonBiteInfoList = [];
                if (recipeColumns) {
                    if (biteConfig.type === comparison_chart_bite_1.ComparisonChartBite.type()) {
                        // avValCols will be empty in this case
                        // We need to find data column pairs that match the recipe
                        comparisonBiteInfoList = _this.findColsForComparisonChart(recipeColumns, hxlTags);
                    }
                    else {
                        // filter the available hxlTags, and not the recipe general tags
                        avValCols = hxlTags.filter(function (col) { return _this.matchInSet(col, recipeColumns); });
                    }
                }
                if (biteConfig.type === timeseries_chart_bite_1.TimeseriesChartBite.type()) {
                    hxlTags.forEach(function (col) {
                        if (col.indexOf('#date') >= 0) {
                            dateColumns.push(col);
                        }
                    });
                }
                _this.logger.info(recipeColumns);
                var biteTitle = biteConfig.title;
                var biteDescription = biteConfig.description;
                var currentFilters = new ingredient_1.BiteFilters(biteConfig.ingredients.filtersWith, biteConfig.ingredients.filtersWithout);
                switch (biteConfig.type) {
                    case timeseries_chart_bite_1.TimeseriesChartBite.type():
                        dateColumns.forEach(function (dateColumn) {
                            aggregateFunctions.forEach(function (aggFunction) {
                                /* For count function we don't need value columns */
                                var modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                                modifiedValueColumns.forEach(function (val) {
                                    var general_ingredient = new ingredient_1.Ingredient(null, val, aggFunction, dateColumn, null, null, currentFilters, biteTitle, biteDescription);
                                    var simple_bite = new timeseries_chart_bite_1.TimeseriesChartBite(general_ingredient);
                                    bite_logic_factory_1.BiteLogicFactory.createBiteLogic(simple_bite).populateHashCode()
                                        .populateWithTitle(columnNames, hxlTags);
                                    observer.next(simple_bite);
                                    avAggCols.forEach(function (agg) {
                                        var ingredient = new ingredient_1.Ingredient(agg, val, aggFunction, dateColumn, null, null, currentFilters, biteTitle, biteDescription);
                                        var multiple_data_bite = new timeseries_chart_bite_1.TimeseriesChartBite(ingredient);
                                        bite_logic_factory_1.BiteLogicFactory.createBiteLogic(multiple_data_bite).populateHashCode()
                                            .populateWithTitle(columnNames, hxlTags);
                                        observer.next(multiple_data_bite);
                                    });
                                });
                            });
                        });
                        break;
                    case comparison_chart_bite_1.ComparisonChartBite.type():
                        aggregateFunctions.forEach(function (aggFunction) {
                            // We add a fake empty column for generating total comparisons (NOR grouped by any col)
                            var avAggColsAndFake = avAggCols.length > 0 ? avAggCols : [''];
                            avAggColsAndFake.forEach(function (agg) {
                                comparisonBiteInfoList.forEach(function (info) {
                                    var ingredient = new ingredient_1.Ingredient(agg, info.valueCol, aggFunction, null, info.comparisonValueCol, info.operator, currentFilters, biteTitle, biteDescription);
                                    var bite = new comparison_chart_bite_1.ComparisonChartBite(ingredient);
                                    bite_logic_factory_1.BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                                    observer.next(bite);
                                });
                            });
                        });
                        break;
                    case chart_bite_1.ChartBite.type():
                        aggregateFunctions.forEach(function (aggFunction) {
                            avAggCols.forEach(function (agg) {
                                /* For count function we don't need value columns */
                                var modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                                modifiedValueColumns.forEach(function (val) {
                                    var ingredient = new ingredient_1.Ingredient(agg, val, aggFunction, null, null, null, currentFilters, biteTitle, biteDescription);
                                    var bite = new chart_bite_1.ChartBite(ingredient);
                                    bite_logic_factory_1.BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                                    observer.next(bite);
                                });
                            });
                        });
                        break;
                    case key_figure_bite_1.KeyFigureBite.type():
                        aggregateFunctions.forEach(function (aggFunction) {
                            /* For count function we don't need value columns */
                            var modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                            modifiedValueColumns.forEach(function (val) {
                                var ingredient = new ingredient_1.Ingredient(null, val, aggFunction, null, null, null, currentFilters, biteTitle, biteDescription);
                                var bite = new key_figure_bite_1.KeyFigureBite(ingredient);
                                bite_logic_factory_1.BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                                observer.next(bite);
                            });
                        });
                        break;
                }
            });
            observer.complete();
        });
        return bites;
    };
    CookBookService.prototype.load = function (url, recipeUrl, chosenCookbookName) {
        var _this = this;
        var cookbookUrls = [recipeUrl];
        var cookBooksObs = cookbookUrls.map(function (book) { return _this.httpClient.get(book); });
        var responseObs = cookBooksObs.reduce(function (prev, current, idx) { return prev.pipe(operators_1.merge(current)); });
        var toListOfCookbooks = function (res) {
            var configJson = res;
            var cookbooks;
            if (Array.isArray(configJson)) {
                var recipes = configJson;
                var cookbook = {
                    title: 'Untitled Cookbook',
                    recipes: recipes,
                    type: 'cookbook'
                };
                cookbooks = [cookbook];
            }
            else if (configJson.type && configJson.type === 'cookbook') {
                var cookbook = configJson;
                cookbooks = [cookbook];
            }
            else if (configJson.type && configJson.type === 'cookbook-library') {
                var cookbookLibrary = configJson;
                cookbooks = cookbookLibrary.cookbooks;
            }
            return cookbooks;
        };
        /**
         * Observable<Response> -> Observable<Cookbook[]> with several events for each json file loaded
         *    -> Observable<Cookbook>
         *    -> Observable<Cookbook[]> one event containing a list with all the cookbooks from all files
         */
        var cookbookListObs = responseObs.pipe(operators_1.mergeMap(toListOfCookbooks), operators_1.toArray());
        var metaRowsObs = this.hxlproxyService.fetchMetaRows(url);
        var cookbooksAndTagsObs = rxjs_1.forkJoin(cookbookListObs, metaRowsObs).pipe(operators_1.map(function (res) {
            var cookbooks = res[0];
            var rows = res[1];
            var columnNames = rows[0];
            var hxlTags = rows[1];
            var chosenCookbook = _this.determineCorrectCookbook(cookbooks, hxlTags, chosenCookbookName);
            return {
                cookbooks: cookbooks,
                chosenCookbook: chosenCookbook,
                hxlTags: hxlTags,
                columnNames: columnNames,
            };
        }));
        cookbooksAndTagsObs.pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
        /**
         * publishLast() - so that an observer subscribing later would receive the last notification again
         * refCount() - so that the first observer subscribing would trigger the start of the HTTP request
         *            ( otherwise a connect() would've been needed)
         */
        var publishedCookbooksAndTagsObs = cookbooksAndTagsObs
            .pipe(operators_1.publishLast(), operators_1.refCount());
        var bites = publishedCookbooksAndTagsObs
            .pipe(operators_1.mergeMap(function (res) {
            return _this.determineAvailableBites(res.columnNames, res.hxlTags, res.chosenCookbook.recipes);
        }));
        var availableCookbooksObs = publishedCookbooksAndTagsObs.pipe(operators_1.map(function (res) { return res.cookbooks; }));
        return {
            biteObs: bites,
            cookbookAndTagsObs: publishedCookbooksAndTagsObs
        };
    };
    CookBookService.prototype.handleError = function (error) {
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
        var retValue = rxjs_1.throwError(errMsg);
        return retValue;
    };
    CookBookService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [mylog_service_1.MyLogService, hxlproxy_service_1.HxlproxyService, http_1.HttpClient])
    ], CookBookService);
    return CookBookService;
}());
exports.CookBookService = CookBookService;
var ComparisonBiteInfo = /** @class */ (function () {
    function ComparisonBiteInfo(operator) {
        this.operator = operator;
    }
    ComparisonBiteInfo.prototype.isFilled = function () {
        if (this.valueCol && this.comparisonValueCol && this.operator) {
            return true;
        }
        return false;
    };
    return ComparisonBiteInfo;
}());
;
//# sourceMappingURL=cook-book.service.js.map