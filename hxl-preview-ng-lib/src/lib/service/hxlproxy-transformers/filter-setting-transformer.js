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
var FilterSettingTransformer = /** @class */ (function (_super) {
    __extends(FilterSettingTransformer, _super);
    function FilterSettingTransformer(innerTransformer, filters, specialFilterValues) {
        var _this = _super.call(this, null) || this;
        _this.innerTransformer = innerTransformer;
        _this.filters = filters;
        _this.specialFilterValues = specialFilterValues;
        return _this;
    }
    FilterSettingTransformer.prototype.buildRecipes = function () {
        var recipes = [];
        if (this.filters.filterWith) {
            recipes.push(new hxl_operations_1.FilterOperation(this.filters.filterWith, true, this.specialFilterValues).recipe);
        }
        if (this.filters.filterWithout) {
            recipes.push(new hxl_operations_1.FilterOperation(this.filters.filterWithout, false, this.specialFilterValues).recipe);
        }
        var innerRecipes = this.innerTransformer.buildRecipes();
        recipes = recipes.concat(innerRecipes);
        return recipes;
    };
    return FilterSettingTransformer;
}(abstract_hxl_transformer_1.AbstractHxlTransformer));
exports.FilterSettingTransformer = FilterSettingTransformer;
//# sourceMappingURL=filter-setting-transformer.js.map