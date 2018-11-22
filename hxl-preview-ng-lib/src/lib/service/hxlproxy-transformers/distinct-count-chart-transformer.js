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
var DistinctCountChartTransformer = /** @class */ (function (_super) {
    __extends(DistinctCountChartTransformer, _super);
    function DistinctCountChartTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DistinctCountChartTransformer.prototype.buildRecipes = function () {
        var recipes = [];
        var countOperation1 = new hxl_operations_1.CountOperation([''], this.groupByTags.concat(this.valueTags), 'count');
        recipes.push(countOperation1.recipe);
        var countOperation2 = new hxl_operations_1.CountOperation([''], this.groupByTags, 'count');
        recipes.push(countOperation2.recipe);
        var renameOperation = new hxl_operations_1.RenameOperation('#meta+count', this.valueTags[0], null);
        recipes.push(renameOperation.recipe);
        return recipes;
    };
    return DistinctCountChartTransformer;
}(abstract_hxl_transformer_1.AbstractHxlTransformer));
exports.DistinctCountChartTransformer = DistinctCountChartTransformer;
//# sourceMappingURL=distinct-count-chart-transformer.js.map