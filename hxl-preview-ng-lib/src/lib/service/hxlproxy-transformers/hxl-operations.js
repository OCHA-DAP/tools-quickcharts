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
var BasicRecipe = /** @class */ (function () {
    function BasicRecipe(filter) {
        this.filter = filter;
    }
    return BasicRecipe;
}());
exports.BasicRecipe = BasicRecipe;
var CountRecipe = /** @class */ (function (_super) {
    __extends(CountRecipe, _super);
    /**
     *
     * @param patterns column names to aggregate by
     * @param aggregators the operations and respective columns. ex: ["sum(#targeted) as Total targeted#targeted+total"]
     */
    function CountRecipe(patterns, aggregators) {
        var _this = _super.call(this, 'count') || this;
        _this.patterns = patterns;
        _this.aggregators = aggregators;
        return _this;
    }
    return CountRecipe;
}(BasicRecipe));
exports.CountRecipe = CountRecipe;
var RenameRecipe = /** @class */ (function (_super) {
    __extends(RenameRecipe, _super);
    /**
     *
     * @param specs string containing old and new tag (plus optional header) #old_tagspec:New header#new_tagspec
     */
    function RenameRecipe(specs) {
        var _this = _super.call(this, 'rename_columns') || this;
        _this.specs = specs;
        return _this;
    }
    return RenameRecipe;
}(BasicRecipe));
var CutRecipe = /** @class */ (function (_super) {
    __extends(CutRecipe, _super);
    /**
     *
     * @param whitelist Tag patterns for the columns to include
     */
    function CutRecipe(whitelist) {
        var _this = _super.call(this, 'with_columns') || this;
        _this.whitelist = whitelist;
        return _this;
    }
    return CutRecipe;
}(BasicRecipe));
var CleanRecipe = /** @class */ (function (_super) {
    __extends(CleanRecipe, _super);
    /**
     *
     * @param date Tag that contains dates to clean
     */
    function CleanRecipe(date) {
        var _this = _super.call(this, 'clean_data') || this;
        _this.date = date;
        return _this;
    }
    return CleanRecipe;
}(BasicRecipe));
var SortRecipe = /** @class */ (function (_super) {
    __extends(SortRecipe, _super);
    /**
     *
     * @param tags comma separated tags by which to sort
     */
    function SortRecipe(tags, reverse) {
        var _this = _super.call(this, 'sort') || this;
        _this.tags = tags;
        _this.reverse = reverse;
        return _this;
    }
    return SortRecipe;
}(BasicRecipe));
var WithoutRowsRecipe = /** @class */ (function (_super) {
    __extends(WithoutRowsRecipe, _super);
    /**
     *
     * @param queries list of conditions like "date+year>2010"
     */
    function WithoutRowsRecipe(queries) {
        var _this = _super.call(this, 'without_rows') || this;
        _this.queries = queries;
        return _this;
    }
    return WithoutRowsRecipe;
}(BasicRecipe));
var WithRowsRecipe = /** @class */ (function (_super) {
    __extends(WithRowsRecipe, _super);
    /**
     *
     * @param queries list of conditions like "date+year>2010"
     */
    function WithRowsRecipe(queries) {
        var _this = _super.call(this, 'with_rows') || this;
        _this.queries = queries;
        return _this;
    }
    return WithRowsRecipe;
}(BasicRecipe));
var AbstractOperation = /** @class */ (function () {
    function AbstractOperation(_recipe) {
        this._recipe = _recipe;
    }
    Object.defineProperty(AbstractOperation.prototype, "recipe", {
        get: function () {
            return this._recipe;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractOperation;
}());
exports.AbstractOperation = AbstractOperation;
var CountOperation = /** @class */ (function (_super) {
    __extends(CountOperation, _super);
    function CountOperation(valueCols, aggCols, operation) {
        var _this = this;
        var aggColumns = [];
        if (aggCols && aggCols.length > 0) {
            aggColumns = aggCols.filter(function (value) { return Boolean(value); });
        }
        if (aggColumns.length === 0) {
            aggColumns.push('#fake_column');
        }
        var operations = valueCols.map(function (valueCol) { return operation + "(" + valueCol + ") as " + (valueCol ? valueCol : '#meta+count'); });
        _this = _super.call(this, new CountRecipe(aggColumns, operations)) || this;
        return _this;
    }
    return CountOperation;
}(AbstractOperation));
exports.CountOperation = CountOperation;
var RenameOperation = /** @class */ (function (_super) {
    __extends(RenameOperation, _super);
    function RenameOperation(oldTag, newTag, newHeader) {
        var _this = this;
        var myNewHeader = newHeader ? newHeader : '';
        _this = _super.call(this, new RenameRecipe(oldTag + ":" + myNewHeader + newTag)) || this;
        return _this;
    }
    return RenameOperation;
}(AbstractOperation));
exports.RenameOperation = RenameOperation;
var CutOperation = /** @class */ (function (_super) {
    __extends(CutOperation, _super);
    function CutOperation(valueCol, aggCols) {
        var _this = this;
        var keepList = [valueCol];
        if (aggCols) {
            keepList = keepList.concat(aggCols.filter(function (value) { return Boolean(value); }));
        }
        _this = _super.call(this, new CutRecipe(keepList)) || this;
        return _this;
    }
    return CutOperation;
}(AbstractOperation));
exports.CutOperation = CutOperation;
var CleanOperation = /** @class */ (function (_super) {
    __extends(CleanOperation, _super);
    function CleanOperation(dateCol) {
        return _super.call(this, new CleanRecipe(dateCol)) || this;
    }
    return CleanOperation;
}(AbstractOperation));
exports.CleanOperation = CleanOperation;
var SortOperation = /** @class */ (function (_super) {
    __extends(SortOperation, _super);
    function SortOperation(col, reverse) {
        var _this = this;
        reverse = reverse ? reverse : false;
        _this = _super.call(this, new SortRecipe(col, reverse)) || this;
        return _this;
    }
    return SortOperation;
}(AbstractOperation));
exports.SortOperation = SortOperation;
var FilterOperation = /** @class */ (function (_super) {
    __extends(FilterOperation, _super);
    /**
     * Filter operation (only based on one column for now)
     * @param filters list of filters from hxl recipe  (@see HxlFilter)
     * @param isWithFilter true if the records matching the filter should be kept, false otherwise
     * @param specialFilterValues dictionary with values for min, max, etc
     */
    function FilterOperation(filters, isWithFilter, specialFilterValues) {
        var _this = this;
        var filterConditions = [];
        filters.forEach(function (pair) {
            var column = Object.keys(pair)[0];
            var value = pair[column];
            var key = column + "-" + value;
            if (specialFilterValues[key]) {
                value = specialFilterValues[key];
            }
            filterConditions.push(column + "=" + value);
        });
        if (isWithFilter) {
            _this = _super.call(this, new WithRowsRecipe(filterConditions)) || this;
        }
        else {
            _this = _super.call(this, new WithoutRowsRecipe(filterConditions)) || this;
        }
        return _this;
    }
    return FilterOperation;
}(AbstractOperation));
exports.FilterOperation = FilterOperation;
//# sourceMappingURL=hxl-operations.js.map