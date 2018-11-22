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
var KeyFigureBite = /** @class */ (function (_super) {
    __extends(KeyFigureBite, _super);
    function KeyFigureBite(ingredient) {
        var _this = _super.call(this, ingredient) || this;
        _this.computedProperties = new KeyFigureComputedProperties();
        _this.uiProperties = new KeyFigureUIProperties();
        _this.dataProperties = new KeyFigureDataProperties();
        // Commented bc we do the same in BiteLogic.populateDataTitleWithHxlProxyInfo()
        // this.dataTitle = ingredient.valueColumn;
        _this.displayCategory = 'Key Figures';
        return _this;
        // this.unit = null;
    }
    KeyFigureBite.type = function () {
        return 'key figure';
    };
    return KeyFigureBite;
}(bite_1.Bite));
exports.KeyFigureBite = KeyFigureBite;
var KeyFigureUIProperties = /** @class */ (function (_super) {
    __extends(KeyFigureUIProperties, _super);
    function KeyFigureUIProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KeyFigureUIProperties;
}(bite_1.UIProperties));
exports.KeyFigureUIProperties = KeyFigureUIProperties;
var KeyFigureComputedProperties = /** @class */ (function (_super) {
    __extends(KeyFigureComputedProperties, _super);
    function KeyFigureComputedProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KeyFigureComputedProperties;
}(bite_1.ComputedProperties));
exports.KeyFigureComputedProperties = KeyFigureComputedProperties;
var KeyFigureDataProperties = /** @class */ (function (_super) {
    __extends(KeyFigureDataProperties, _super);
    function KeyFigureDataProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KeyFigureDataProperties;
}(bite_1.DataProperties));
exports.KeyFigureDataProperties = KeyFigureDataProperties;
//# sourceMappingURL=key-figure-bite.js.map