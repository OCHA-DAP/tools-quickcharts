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
var units_util_1 = require("../util/units-util");
var bite_logic_1 = require("./bite-logic");
var key_figure_bite_1 = require("./key-figure-bite");
var KeyFigureBiteLogic = /** @class */ (function (_super) {
    __extends(KeyFigureBiteLogic, _super);
    function KeyFigureBiteLogic(bite) {
        var _this = _super.call(this, bite) || this;
        _this.bite = bite;
        return _this;
    }
    KeyFigureBiteLogic.prototype.computeBiteUnit = function (forceRecompute) {
        if (forceRecompute || !this.computedProperties.unit) {
            this.computedProperties.unit = units_util_1.UnitsUtil.computeBiteUnit(this.dataProperties.value);
        }
    };
    KeyFigureBiteLogic.prototype.populateWithHxlProxyInfo = function (hxlData, tagToTitleMap) {
        this.populateDataTitleWithHxlProxyInfo();
        var hxlTagIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
        if (hxlTagIndex >= 0) {
            this.dataProperties.value = hxlData[2][hxlTagIndex];
            this.computeBiteUnit(false);
        }
        else {
            throw new Error(this.bite.ingredient.valueColumn + " not found in hxl proxy response");
        }
        return this;
    };
    KeyFigureBiteLogic.prototype.initUIProperties = function () {
        return new key_figure_bite_1.KeyFigureUIProperties();
    };
    KeyFigureBiteLogic.prototype.initComputedProperties = function () {
        return new key_figure_bite_1.KeyFigureComputedProperties();
    };
    KeyFigureBiteLogic.prototype.initDataProperties = function () {
        return new key_figure_bite_1.KeyFigureDataProperties();
    };
    KeyFigureBiteLogic.prototype.colorUsage = function () {
        return bite_logic_1.ColorUsage.NONE;
    };
    Object.defineProperty(KeyFigureBiteLogic.prototype, "dataProperties", {
        get: function () {
            return this.bite.dataProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "uiProperties", {
        get: function () {
            return this.bite.uiProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "computedProperties", {
        get: function () {
            return this.bite.computedProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "preText", {
        get: function () {
            return this.uiProperties.preText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "postText", {
        get: function () {
            return this.uiProperties.postText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "numberFormat", {
        get: function () {
            return this.uiProperties.numberFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "unit", {
        get: function () {
            var defaultUnit = this.computedProperties.unit;
            return this.uiProperties.unit == null ? defaultUnit : this.uiProperties.unit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyFigureBiteLogic.prototype, "value", {
        get: function () {
            return this.dataProperties.value;
        },
        enumerable: true,
        configurable: true
    });
    return KeyFigureBiteLogic;
}(bite_logic_1.BiteLogic));
exports.KeyFigureBiteLogic = KeyFigureBiteLogic;
//# sourceMappingURL=key-figure-bite-logic.js.map