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
var timeseries_chart_bite_1 = require("./timeseries-chart-bite");
var bite_logic_1 = require("./bite-logic");
var chart_bite_logic_1 = require("./chart-bite-logic");
var TimeseriesChartBiteLogic = /** @class */ (function (_super) {
    __extends(TimeseriesChartBiteLogic, _super);
    function TimeseriesChartBiteLogic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeseriesChartBiteLogic.prototype.initUIProperties = function () {
        return new timeseries_chart_bite_1.TimeseriesChartUIProperties();
    };
    TimeseriesChartBiteLogic.prototype.populateWithTitle = function (columnNames, hxlTags) {
        _super.prototype.populateWithTitle.call(this, columnNames, hxlTags);
        var dateColumn = columnNames[this.tagToIndexMap[this.bite.ingredient.dateColumn]];
        this.bite.computedProperties.title += " by " + dateColumn;
        return this;
    };
    TimeseriesChartBiteLogic.prototype.populateWithHxlProxyInfo = function (hxlData, tagToTitleMap) {
        _super.prototype.populateDataTitleWithHxlProxyInfo.call(this);
        var valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
        var dateColIndex = this.findHxlTagIndex(this.bite.ingredient.dateColumn, hxlData);
        if (this.bite.ingredient.aggregateColumn) {
            var aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);
            this.multipleLinePopulateDataForChart(aggColIndex, hxlData, dateColIndex, valColIndex);
        }
        else {
            this.simplePopulateDataForChart(dateColIndex, valColIndex, hxlData);
        }
        return this;
    };
    TimeseriesChartBiteLogic.prototype.buildImportantPropertiesList = function () {
        var importantProperties = _super.prototype.buildImportantPropertiesList.call(this);
        importantProperties.push(this.bite.ingredient.dateColumn);
        return importantProperties;
    };
    TimeseriesChartBiteLogic.prototype.multipleLinePopulateDataForChart = function (aggColIndex, hxlData, dateColIndex, valColIndex) {
        var foundGroups = this.findGroups(aggColIndex, hxlData);
        var values = [];
        var groupToIdxMap = {};
        foundGroups.forEach(function (group, idx) {
            values.push([group]);
            groupToIdxMap[group] = idx;
        });
        var dates = ['Date'];
        var prevDate = null;
        for (var i = 2; i < hxlData.length; i++) {
            var date = hxlData[i][dateColIndex];
            if (date !== prevDate) {
                prevDate = date;
                dates.push(date);
                values.forEach(function (groupList) { return groupList.push(0); });
            }
            var group = hxlData[i][aggColIndex];
            if (group && group.trim()) {
                var val = hxlData[i][valColIndex];
                var valueList = values[groupToIdxMap[group]];
                valueList[valueList.length - 1] = val;
            }
        }
        values.splice(0, 0, dates);
        this.dataProperties.values = values;
    };
    TimeseriesChartBiteLogic.prototype.simplePopulateDataForChart = function (dateColIndex, valColIndex, hxlData) {
        if (dateColIndex >= 0 && valColIndex >= 0) {
            var values = [this.bite.computedProperties.dataTitle];
            var categories = ['Date'];
            for (var i = 2; i < hxlData.length; i++) {
                values.push(hxlData[i][valColIndex]);
                categories.push(hxlData[i][dateColIndex]);
            }
            this.dataProperties.values = [categories, values];
        }
        else {
            throw new Error(this.bite.ingredient.valueColumn + " or " + this.bite.ingredient.aggregateColumn
                + 'not found in hxl proxy response');
        }
    };
    TimeseriesChartBiteLogic.prototype.findGroups = function (aggColIndex, hxlData) {
        var mySet = new Set();
        for (var i = 2; i < hxlData.length; i++) {
            var group = hxlData[i][aggColIndex];
            if (group && group.trim()) {
                mySet.add(group.trim());
            }
        }
        var result = [];
        mySet.forEach(function (item) { return result.push(item); });
        return result;
    };
    TimeseriesChartBiteLogic.prototype.usesDateColumn = function () {
        // if (this.bite.ingredient.dateColumn) {
        //   return true;
        // }
        return true;
    };
    TimeseriesChartBiteLogic.prototype.colorUsage = function () {
        if (this.bite.ingredient.aggregateColumn) {
            return bite_logic_1.ColorUsage.MANY;
        }
        return bite_logic_1.ColorUsage.ONE;
    };
    Object.defineProperty(TimeseriesChartBiteLogic.prototype, "uiProperties", {
        get: function () {
            return this.bite.uiProperties;
        },
        enumerable: true,
        configurable: true
    });
    return TimeseriesChartBiteLogic;
}(chart_bite_logic_1.ChartBiteLogic));
exports.TimeseriesChartBiteLogic = TimeseriesChartBiteLogic;
//# sourceMappingURL=timeseries-chart-bite-logic.js.map