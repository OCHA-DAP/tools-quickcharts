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
var chart_bite_1 = require("./chart-bite");
var ChartBiteLogic = /** @class */ (function (_super) {
    __extends(ChartBiteLogic, _super);
    function ChartBiteLogic(bite) {
        var _this = _super.call(this, bite) || this;
        _this.bite = bite;
        return _this;
    }
    ChartBiteLogic.prototype.populateWithHxlProxyInfo = function (hxlData, tagToTitleMap) {
        _super.prototype.populateDataTitleWithHxlProxyInfo.call(this);
        var valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
        var aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);
        var dataProperties = this.bite.dataProperties;
        var computedProperties = this.bite.computedProperties;
        if (aggColIndex >= 0 && valColIndex >= 0) {
            dataProperties.values = [computedProperties.dataTitle];
            dataProperties.categories = [];
            for (var i = 2; i < hxlData.length; i++) {
                dataProperties.values.push(hxlData[i][valColIndex]);
                dataProperties.categories.push(hxlData[i][aggColIndex]);
            }
            computedProperties.pieChart = !(dataProperties.values.length > 5);
        }
        else {
            throw new Error(this.bite.ingredient.valueColumn + " or " + this.bite.ingredient.aggregateColumn
                + 'not found in hxl proxy response');
        }
        return this;
    };
    ChartBiteLogic.prototype.initUIProperties = function () {
        return new chart_bite_1.ChartUIProperties();
    };
    ChartBiteLogic.prototype.initComputedProperties = function () {
        return new chart_bite_1.ChartComputedProperties();
    };
    ChartBiteLogic.prototype.initDataProperties = function () {
        return new chart_bite_1.ChartDataProperties();
    };
    ChartBiteLogic.prototype.colorUsage = function () {
        if (this.pieChart) {
            return bite_logic_1.ColorUsage.NONE;
        }
        return bite_logic_1.ColorUsage.ONE;
    };
    Object.defineProperty(ChartBiteLogic.prototype, "dataProperties", {
        get: function () {
            return this.bite.dataProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "uiProperties", {
        get: function () {
            return this.bite.uiProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "computedProperties", {
        get: function () {
            return this.bite.computedProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "pieChart", {
        get: function () {
            return this.computedProperties.pieChart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "swapAxis", {
        get: function () {
            return this.uiProperties.swapAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "showGrid", {
        get: function () {
            return this.uiProperties.showGrid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "color", {
        get: function () {
            return this.uiProperties.color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "sorting", {
        get: function () {
            return this.uiProperties.sorting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "limit", {
        get: function () {
            return this.uiProperties.limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "categories", {
        get: function () {
            return this.dataProperties.categories;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartBiteLogic.prototype, "values", {
        get: function () {
            return this.dataProperties.values;
        },
        enumerable: true,
        configurable: true
    });
    return ChartBiteLogic;
}(bite_logic_1.BiteLogic));
exports.ChartBiteLogic = ChartBiteLogic;
//# sourceMappingURL=chart-bite-logic.js.map