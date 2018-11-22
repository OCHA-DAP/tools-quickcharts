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
var chart_bite_1 = require("./chart-bite");
var TimeseriesChartBite = /** @class */ (function (_super) {
    __extends(TimeseriesChartBite, _super);
    function TimeseriesChartBite(ingredient) {
        var _this = _super.call(this, ingredient) || this;
        _this.displayCategory = 'Timeseries';
        _this.uiProperties = new TimeseriesChartUIProperties();
        return _this;
    }
    TimeseriesChartBite.type = function () {
        return 'timeseries';
    };
    return TimeseriesChartBite;
}(chart_bite_1.ChartBite));
exports.TimeseriesChartBite = TimeseriesChartBite;
var TimeseriesChartUIProperties = /** @class */ (function (_super) {
    __extends(TimeseriesChartUIProperties, _super);
    function TimeseriesChartUIProperties() {
        var _this = _super.call(this) || this;
        _this.color = chart_bite_1.ChartBite.colorPattern[1];
        return _this;
    }
    return TimeseriesChartUIProperties;
}(chart_bite_1.ChartUIProperties));
exports.TimeseriesChartUIProperties = TimeseriesChartUIProperties;
//# sourceMappingURL=timeseries-chart-bite.js.map