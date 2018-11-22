"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var bite_logic_1 = require("./bite-logic");
var comparison_chart_bite_1 = require("./comparison-chart-bite");
var chart_bite_logic_1 = require("./chart-bite-logic");
var ComparisonChartBiteLogic = /** @class */ (function (_super) {
    __extends(ComparisonChartBiteLogic, _super);
    function ComparisonChartBiteLogic(bite) {
        var _this = _super.call(this, bite) || this;
        _this.bite = bite;
        return _this;
    }
    ComparisonChartBiteLogic.prototype.buildImportantPropertiesList = function () {
        var importantProperties = _super.prototype.buildImportantPropertiesList.call(this);
        importantProperties.push(this.bite.ingredient.comparisonValueColumn, this.bite.ingredient.comparisonOperator);
        return importantProperties;
    };
    ComparisonChartBiteLogic.prototype.populateWithHxlProxyInfo = function (hxlData, tagToTitleMap) {
        _super.prototype.populateWithHxlProxyInfo.call(this, hxlData, tagToTitleMap);
        this.computedProperties.pieChart = false;
        var valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
        var compColIndex = this.findHxlTagIndex(this.bite.ingredient.comparisonValueColumn, hxlData);
        if (compColIndex >= 0) {
            this.dataProperties.comparisonValues = [this.bite.ingredient.comparisonValueColumn];
            for (var i = 2; i < hxlData.length; i++) {
                var computedValue = hxlData[i][compColIndex];
                // If we have more than 1 row of data
                // if (hxlData.length > 3) {
                //   computedValue = computedValue - hxlData[i][valColIndex];
                // }
                this.dataProperties.comparisonValues.push(computedValue);
            }
        }
        else {
            throw new Error("" + this.bite.ingredient.comparisonValueColumn + ' not found in hxl proxy response');
        }
        return this;
    };
    ComparisonChartBiteLogic.prototype.populateDataTitleWithHxlProxyInfo = function () {
        _super.prototype.populateDataTitleWithHxlProxyInfo.call(this);
        var computedProperties = this.bite.computedProperties;
        if (!computedProperties.comparisonDataTitle) {
            var ingredient = this.bite.ingredient;
            computedProperties.comparisonDataTitle = ingredient.comparisonValueColumn;
        }
        return this;
    };
    ComparisonChartBiteLogic.prototype.populateWithTitle = function (columnNames, hxlTags) {
        _super.prototype.populateWithTitle.call(this, columnNames, hxlTags);
        var computedProperties = this.bite.computedProperties;
        var availableTags = {};
        hxlTags.forEach(function (v, idx) { return availableTags[v] = idx; });
        var ingrValColumn = this.bite.ingredient.comparisonValueColumn;
        var valueColumn = columnNames[availableTags[ingrValColumn]];
        var hxlValueColumn = hxlTags[availableTags[ingrValColumn]];
        computedProperties.comparisonDataTitle = (valueColumn && valueColumn.length > 0) ? valueColumn : hxlValueColumn;
        return this;
    };
    ComparisonChartBiteLogic.prototype.initUIProperties = function () {
        return new comparison_chart_bite_1.ComparisonChartUIProperties();
    };
    ComparisonChartBiteLogic.prototype.initDataProperties = function () {
        return new comparison_chart_bite_1.ComparisonChartDataProperties();
    };
    ComparisonChartBiteLogic.prototype.colorUsage = function () {
        return bite_logic_1.ColorUsage.MANY;
    };
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "dataProperties", {
        get: function () {
            return this.bite.dataProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "uiProperties", {
        get: function () {
            return this.bite.uiProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "valueColumns", {
        get: function () {
            return [
                this.bite.ingredient.valueColumn,
                this.bite.ingredient.comparisonValueColumn
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "comparisonValues", {
        get: function () {
            return this.dataProperties.comparisonValues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "stackChart", {
        get: function () {
            return this.uiProperties.stackChart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "comparisonDataTitle", {
        get: function () {
            var uiProperties = this.bite.uiProperties;
            var computedProperties = this.bite.computedProperties;
            var defaultDataTitle = computedProperties.comparisonDataTitle;
            var comparisonDataTitle = uiProperties.comparisonDataTitle == null ? defaultDataTitle : uiProperties.comparisonDataTitle;
            return comparisonDataTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComparisonChartBiteLogic.prototype, "comparisonColor", {
        get: function () {
            return this.uiProperties.comparisonColor;
        },
        enumerable: true,
        configurable: true
    });
    return ComparisonChartBiteLogic;
}(chart_bite_logic_1.ChartBiteLogic));
exports.ComparisonChartBiteLogic = ComparisonChartBiteLogic;
//# sourceMappingURL=comparison-chart-bite-logic.js.map