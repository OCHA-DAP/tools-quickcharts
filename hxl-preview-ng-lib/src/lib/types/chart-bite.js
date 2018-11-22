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
var bite_1 = require("./bite");
var ChartBite = /** @class */ (function (_super) {
    __extends(ChartBite, _super);
    function ChartBite(ingredient) {
        var _this = _super.call(this, ingredient) || this;
        _this.computedProperties = new ChartComputedProperties();
        _this.uiProperties = new ChartUIProperties();
        _this.dataProperties = new ChartDataProperties();
        _this.displayCategory = 'Charts';
        return _this;
    }
    ChartBite.type = function () {
        return 'chart';
    };
    ChartBite.colorPattern = ['#1ebfb3', '#0077ce', '#f2645a', '#9C27B0'];
    ChartBite.SORT_DESC = 'DESC';
    ChartBite.SORT_ASC = 'ASC';
    return ChartBite;
}(bite_1.Bite));
exports.ChartBite = ChartBite;
var ChartUIProperties = /** @class */ (function (_super) {
    __extends(ChartUIProperties, _super);
    function ChartUIProperties() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.swapAxis = true;
        _this.showGrid = false;
        _this.color = ChartBite.colorPattern[0];
        _this.sorting = ChartBite.SORT_DESC;
        return _this;
    }
    return ChartUIProperties;
}(bite_1.UIProperties));
exports.ChartUIProperties = ChartUIProperties;
var ChartComputedProperties = /** @class */ (function (_super) {
    __extends(ChartComputedProperties, _super);
    function ChartComputedProperties() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pieChart = false;
        return _this;
    }
    return ChartComputedProperties;
}(bite_1.ComputedProperties));
exports.ChartComputedProperties = ChartComputedProperties;
var ChartDataProperties = /** @class */ (function (_super) {
    __extends(ChartDataProperties, _super);
    function ChartDataProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChartDataProperties;
}(bite_1.DataProperties));
exports.ChartDataProperties = ChartDataProperties;
//# sourceMappingURL=chart-bite.js.map