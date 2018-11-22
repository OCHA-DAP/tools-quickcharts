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
var abstract_hxl_transformer_1 = require("./abstract-hxl-transformer");
var hxl_operations_1 = require("./hxl-operations");
var TimeseriesChartTransformer = /** @class */ (function (_super) {
    __extends(TimeseriesChartTransformer, _super);
    function TimeseriesChartTransformer(transformer, dateColumn) {
        var _this = _super.call(this, null) || this;
        _this.dateTag = dateColumn;
        _this.innerTransformer = transformer;
        return _this;
    }
    TimeseriesChartTransformer.prototype.buildRecipes = function () {
        var recipes = [];
        var cleanOperation = new hxl_operations_1.CleanOperation(this.dateTag);
        recipes.push(cleanOperation.recipe);
        var sortOperation = new hxl_operations_1.SortOperation(this.dateTag);
        recipes.push(sortOperation.recipe);
        /* insert date as first grouping column */
        this.innerTransformer.groupByTags.splice(0, 0, this.dateTag);
        var innerRecipes = this.innerTransformer.buildRecipes();
        recipes = recipes.concat(innerRecipes);
        return recipes;
    };
    return TimeseriesChartTransformer;
}(abstract_hxl_transformer_1.AbstractHxlTransformer));
exports.TimeseriesChartTransformer = TimeseriesChartTransformer;
//# sourceMappingURL=timeseries-chart-transformer.js.map