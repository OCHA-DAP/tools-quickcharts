"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractHxlTransformer = /** @class */ (function () {
    function AbstractHxlTransformer(biteLogic) {
        this.biteLogic = biteLogic;
        if (biteLogic) {
            var bite = biteLogic.getBite();
            this.type = bite.type;
            this.valueTags = biteLogic.valueColumns;
            this.groupByTags = bite.ingredient.aggregateColumn ? [bite.ingredient.aggregateColumn] : [];
            this.aggregateFunction = bite.ingredient.aggregateFunction;
        }
    }
    AbstractHxlTransformer.prototype.generateJsonFromRecipes = function () {
        return JSON.stringify(this.buildRecipes());
    };
    return AbstractHxlTransformer;
}());
exports.AbstractHxlTransformer = AbstractHxlTransformer;
//# sourceMappingURL=abstract-hxl-transformer.js.map