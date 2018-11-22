"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BiteLogic = /** @class */ (function () {
    function BiteLogic(bite) {
        this.bite = bite;
        this.tagToIndexMap = {};
    }
    /**
     * Generally used before saving the bite. We don't want the values to be saved as well.
     * The bites should have fresh data loaded from the data source each time.
     *
     * @return
     */
    BiteLogic.prototype.unpopulateBite = function () {
        this.bite.dataProperties = this.initDataProperties();
        this.bite.tempShowSaveCancelButtons = false;
        return this;
    };
    BiteLogic.prototype.resetBite = function () {
        this.bite.dataProperties = this.initDataProperties();
        this.bite.uiProperties = this.initUIProperties();
        this.bite.computedProperties = this.initComputedProperties();
        this.bite.tempShowSaveCancelButtons = false;
        return this;
    };
    BiteLogic.prototype.populateDataTitleWithHxlProxyInfo = function () {
        if (!this.bite.computedProperties.dataTitle) {
            this.bite.computedProperties.dataTitle = this.bite.ingredient.valueColumn;
        }
        return this;
    };
    BiteLogic.prototype.findHxlTagIndex = function (hxlTag, hxlData) {
        if (hxlData && hxlData.length > 2) {
            for (var i = 0; i < hxlData[1].length; i++) {
                var currentTag = hxlData[1][i];
                if (currentTag === hxlTag) {
                    return i;
                }
            }
        }
        return -1;
    };
    BiteLogic.prototype.getBite = function () {
        return this.bite;
    };
    BiteLogic.prototype.populateHashCode = function () {
        this.bite.hashCode = this.strListHash(this.buildImportantPropertiesList());
        return this;
    };
    BiteLogic.prototype.buildImportantPropertiesList = function () {
        var importantProperties = [];
        importantProperties.push(this.bite.ingredient.title, this.bite.type);
        importantProperties.push(this.bite.ingredient.valueColumn, this.bite.ingredient.aggregateColumn);
        return importantProperties;
    };
    BiteLogic.prototype.strHash = function (theString, startHash) {
        var i, chr, len;
        var hash = startHash ? startHash : 0;
        if (!theString || theString.length === 0) {
            return hash;
        }
        for (i = 0, len = theString.length; i < len; i++) {
            chr = theString.charCodeAt(i);
            /* tslint:disable */
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
            /* tslint:enable */
        }
        return hash;
    };
    ;
    BiteLogic.prototype.strListHash = function (strList) {
        var hash = 0;
        if (strList) {
            for (var i = 0; i < strList.length; i++) {
                var curStr = strList[i];
                hash = this.strHash(curStr, hash);
            }
        }
        return hash;
    };
    ;
    BiteLogic.prototype.populateWithTitle = function (columnNames, hxlTags) {
        var _this = this;
        hxlTags.forEach(function (v, idx) { return _this.tagToIndexMap[v] = idx; });
        var valueColumn = columnNames[this.tagToIndexMap[this.bite.ingredient.valueColumn]];
        var hxlValueColumn = hxlTags[this.tagToIndexMap[this.bite.ingredient.valueColumn]];
        var groupColumn = columnNames[this.tagToIndexMap[this.bite.ingredient.aggregateColumn]];
        if (!this.bite.ingredient.title) {
            var aggFunction = null;
            switch (this.bite.ingredient.aggregateFunction) {
                case 'count':
                    aggFunction = 'Row Count';
                    break;
                case 'distinct-count':
                    aggFunction = 'Unique Values in';
                    break;
                case 'sum':
                    aggFunction = 'Sum of';
                    break;
                default:
                    aggFunction = 'Sum of';
                    break;
            }
            var title = aggFunction;
            if (valueColumn && valueColumn.trim().length > 0) {
                title += ' ' + valueColumn;
            }
            else if (hxlValueColumn && hxlValueColumn.trim().length > 0) {
                title += ' ' + hxlValueColumn;
            }
            if (groupColumn && groupColumn.trim().length > 0) {
                title += ' by ' + groupColumn;
            }
            this.bite.computedProperties.title = title;
        }
        this.bite.computedProperties.dataTitle = (valueColumn && valueColumn.length > 0) ? valueColumn : hxlValueColumn;
        return this;
    };
    BiteLogic.prototype.hasFilters = function () {
        if (this.bite.ingredient.filters) {
            var filterWith = this.bite.ingredient.filters.filterWith;
            var filterWithout = this.bite.ingredient.filters.filterWithout;
            if (filterWith && filterWith.length > 0) {
                return true;
            }
            else if (filterWithout && filterWithout.length > 0) {
                return true;
            }
        }
        return false;
    };
    BiteLogic.prototype.usesDateColumn = function () {
        // if (this.bite.ingredient.dateColumn) {
        //   return true;
        // }
        return false;
    };
    Object.defineProperty(BiteLogic.prototype, "dataProperties", {
        get: function () {
            return this.bite.dataProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "uiProperties", {
        get: function () {
            return this.bite.uiProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "computedProperties", {
        get: function () {
            return this.bite.computedProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "dateColumn", {
        get: function () {
            return this.bite.ingredient.dateColumn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "valueColumns", {
        get: function () {
            return [this.bite.ingredient.valueColumn];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "title", {
        get: function () {
            var defaultTitle = this.bite.ingredient.title || this.bite.computedProperties.title;
            var title = (this.bite.uiProperties.title == null ? defaultTitle : this.bite.uiProperties.title);
            return title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "description", {
        get: function () {
            var defaultDescription = this.bite.ingredient.description;
            var description = this.bite.uiProperties.description == null ? defaultDescription : this.bite.uiProperties.description;
            return description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "dataTitle", {
        get: function () {
            var defaultDataTitle = this.bite.computedProperties.dataTitle;
            var dataTitle = this.bite.uiProperties.dataTitle == null ? defaultDataTitle : this.bite.uiProperties.dataTitle;
            return dataTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BiteLogic.prototype, "tempShowSaveCancelButtons", {
        get: function () {
            this.bite.tempShowSaveCancelButtons = this.bite.tempShowSaveCancelButtons || false;
            return this.bite.tempShowSaveCancelButtons;
        },
        set: function (tempShowSaveCancelButtons) {
            this.bite.tempShowSaveCancelButtons = tempShowSaveCancelButtons;
        },
        enumerable: true,
        configurable: true
    });
    return BiteLogic;
}());
exports.BiteLogic = BiteLogic;
var ColorUsage;
(function (ColorUsage) {
    ColorUsage[ColorUsage["NONE"] = 0] = "NONE";
    ColorUsage[ColorUsage["ONE"] = 1] = "ONE";
    ColorUsage[ColorUsage["MANY"] = 2] = "MANY";
})(ColorUsage = exports.ColorUsage || (exports.ColorUsage = {}));
//# sourceMappingURL=bite-logic.js.map