"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ingredient = /** @class */ (function () {
    function Ingredient(aggregateColumn, valueColumn, aggregateFunction, dateColumn, comparisonValueColumn, comparisonOperator, filters, title, description) {
        this.aggregateColumn = aggregateColumn;
        this.valueColumn = valueColumn;
        this.aggregateFunction = aggregateFunction;
        this.dateColumn = dateColumn;
        this.comparisonValueColumn = comparisonValueColumn;
        this.comparisonOperator = comparisonOperator;
        this.filters = filters;
        this.title = title;
        this.description = description;
    }
    return Ingredient;
}());
exports.Ingredient = Ingredient;
var BiteFilters = /** @class */ (function () {
    function BiteFilters(filterWith, filterWithout) {
        this.filterWith = filterWith;
        this.filterWithout = filterWithout;
    }
    return BiteFilters;
}());
exports.BiteFilters = BiteFilters;
//# sourceMappingURL=ingredient.js.map