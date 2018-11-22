"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bite = /** @class */ (function () {
    function Bite(ingredient) {
        this.tempShowSaveCancelButtons = false;
        this.ingredient = ingredient;
        this.type = this.constructor.type();
        this.errorMsg = null;
    }
    Bite.type = function () {
        return 'bite';
    };
    return Bite;
}());
exports.Bite = Bite;
var ComputedProperties = /** @class */ (function () {
    function ComputedProperties() {
    }
    return ComputedProperties;
}());
exports.ComputedProperties = ComputedProperties;
var UIProperties = /** @class */ (function () {
    function UIProperties() {
    }
    return UIProperties;
}());
exports.UIProperties = UIProperties;
/**
 * Data coming from the hxl proxy (processed maybe for showing in the charts)
 */
var DataProperties = /** @class */ (function () {
    function DataProperties() {
    }
    return DataProperties;
}());
exports.DataProperties = DataProperties;
//# sourceMappingURL=bite.js.map