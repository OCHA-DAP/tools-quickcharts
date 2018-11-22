"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnitsUtil = /** @class */ (function () {
    function UnitsUtil() {
    }
    UnitsUtil.computeBiteUnit = function (value) {
        var unit = null;
        if (value > 1000000000.0) {
            unit = 'bln';
        }
        else if (value > 1000000.0) {
            unit = 'mln';
        }
        else if (value > 1000.0) {
            unit = 'k';
        }
        return unit;
    };
    UnitsUtil.transform = function (value, format, unit) {
        var modifiedValue = UnitsUtil.computeValueBasedOnUnit(value, unit);
        if (format) {
            return modifiedValue.toLocaleString(format);
        }
        return modifiedValue + '';
    };
    UnitsUtil.computeValueBasedOnUnit = function (value, unit) {
        if (unit) {
            var newValue = value;
            switch (unit) {
                case 'k':
                    newValue = newValue / 1000.0;
                    break;
                case 'mln':
                    newValue = newValue / 1000000.0;
                    break;
                case 'bln':
                    newValue = newValue / 1000000000.0;
                    break;
            }
            /* Keep only one decimal value  */
            return Math.round(newValue * 10.0) / 10.0;
        }
        return value;
    };
    return UnitsUtil;
}());
exports.UnitsUtil = UnitsUtil;
//# sourceMappingURL=units-util.js.map