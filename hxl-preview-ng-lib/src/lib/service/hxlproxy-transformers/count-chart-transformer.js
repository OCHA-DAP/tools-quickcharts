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
var CountChartTransformer = /** @class */ (function (_super) {
    __extends(CountChartTransformer, _super);
    function CountChartTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // protected metaTagForAggColumn = '#meta+count';
    // protected nameForAggregatedValueColumn(): string {
    //   return '#count';
    // }
    CountChartTransformer.prototype.buildRecipes = function () {
        var recipes = [];
        var countOperation = new hxl_operations_1.CountOperation(this.valueTags, this.groupByTags, this.aggregateFunction);
        recipes.push(countOperation.recipe);
        if (this.groupByTags) {
            var dateTag = null;
            for (var i = 0; i < this.groupByTags.length; i++) {
                var tag = this.groupByTags[i];
                if (tag.indexOf('#date') >= 0) {
                    dateTag = tag;
                    break;
                }
            }
            var sortOperation = new hxl_operations_1.SortOperation(dateTag, true);
            recipes.push(sortOperation.recipe);
        }
        // let cutOperation = new CutOperation('#meta+sum', this.biteInfo.groupByTags);
        // recipes.push(cutOperation.recipe);
        // const renameOperation = new RenameOperation(this.metaTagForAggColumn, this.nameForAggregatedValueColumn(), null);
        // recipes.push(renameOperation.recipe);
        return recipes;
    };
    return CountChartTransformer;
}(abstract_hxl_transformer_1.AbstractHxlTransformer));
exports.CountChartTransformer = CountChartTransformer;
//# sourceMappingURL=count-chart-transformer.js.map