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
var ComparisonChartBite = /** @class */ (function (_super) {
    __extends(ComparisonChartBite, _super);
    function ComparisonChartBite(ingredient) {
        var _this = _super.call(this, ingredient) || this;
        _this.dataProperties = new ComparisonChartDataProperties();
        _this.uiProperties = new ComparisonChartUIProperties();
        _this.computedProperties = new ComparisonChartComputedProperties();
        return _this;
    }
    ComparisonChartBite.type = function () {
        return 'comparison-chart';
    };
    return ComparisonChartBite;
}(chart_bite_1.ChartBite));
exports.ComparisonChartBite = ComparisonChartBite;
var ComparisonChartDataProperties = /** @class */ (function (_super) {
    __extends(ComparisonChartDataProperties, _super);
    function ComparisonChartDataProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComparisonChartDataProperties;
}(chart_bite_1.ChartDataProperties));
exports.ComparisonChartDataProperties = ComparisonChartDataProperties;
var ComparisonChartComputedProperties = /** @class */ (function (_super) {
    __extends(ComparisonChartComputedProperties, _super);
    function ComparisonChartComputedProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComparisonChartComputedProperties;
}(chart_bite_1.ChartComputedProperties));
exports.ComparisonChartComputedProperties = ComparisonChartComputedProperties;
var ComparisonChartUIProperties = /** @class */ (function (_super) {
    __extends(ComparisonChartUIProperties, _super);
    function ComparisonChartUIProperties() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stackChart = false;
        _this.comparisonColor = chart_bite_1.ChartBite.colorPattern[1];
        return _this;
    }
    return ComparisonChartUIProperties;
}(chart_bite_1.ChartUIProperties));
exports.ComparisonChartUIProperties = ComparisonChartUIProperties;
//# sourceMappingURL=comparison-chart-bite.js.map