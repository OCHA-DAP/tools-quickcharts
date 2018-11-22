"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Mostly based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js
 */
var Pattern = /** @class */ (function () {
    /**
     * Based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js hxl.classes.Pattern.parse()
     * @param hxlPattern
     */
    function Pattern(hxlPattern) {
        this.includeAttributes = new Set();
        this.excludeAttributes = new Set();
        var result = String(hxlPattern).match(/^\s*#?([A-Za-z][A-Za-z0-9_]*)((?:\s*[+-][A-Za-z][A-Za-z0-9_]*)*)\s*$/);
        if (result) {
            var attributeSpecs = result[2].split(/\s*([+-])/).filter(function (item) { return item; });
            for (var i = 0; i < attributeSpecs.length; i += 2) {
                if (attributeSpecs[i] === '+') {
                    this.includeAttributes.add(attributeSpecs[i + 1]);
                }
                else {
                    this.excludeAttributes.add(attributeSpecs[i + 1]);
                }
            }
            this.tag = '#' + result[1];
        }
    }
    Pattern.matchPatternToColumn = function (hxlPattern, hxlColumn) {
        if (hxlPattern && hxlPattern.trim() && hxlColumn && hxlColumn.trim()) {
            hxlPattern = hxlPattern.trim();
            hxlColumn = hxlColumn.trim();
            var key = hxlPattern + "-" + hxlColumn;
            var result = Pattern.matchingResultsMap[key];
            if (!result && result !== false) {
                var pattern = Pattern.parse(hxlPattern);
                result = pattern.matchHxlColumn(hxlColumn);
                Pattern.matchingResultsMap[key] = result;
                // console.log(`Match computed for ${key} -> ${result}`);
            }
            else {
                // console.log(`Match result found in cache for ${key} -> ${result}`);
            }
            return result;
        }
        else if (!hxlColumn || !hxlColumn.trim()) {
            return false;
        }
        throw new Error('hxlPattern should not be empty');
    };
    Pattern.parse = function (hxlPattern) {
        hxlPattern = hxlPattern.trim();
        var pattern = Pattern.existingPatternMap[hxlPattern];
        if (!pattern) {
            pattern = new Pattern(hxlPattern);
            Pattern.existingPatternMap[hxlPattern] = pattern;
        }
        return pattern;
    };
    Pattern.prototype.matchAttributes = function (colAttributes) {
        var attributesMatch = true;
        this.includeAttributes.forEach(function (inclAttribute) {
            if (!colAttributes.has(inclAttribute)) {
                attributesMatch = false;
            }
        });
        if (attributesMatch) {
            this.excludeAttributes.forEach(function (exclAttribute) {
                if (colAttributes.has(exclAttribute)) {
                    attributesMatch = false;
                }
            });
        }
        return attributesMatch;
    };
    Pattern.prototype.matchHxlColumn = function (hxlColumn) {
        /**
         * Based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js hxl.classes.Column.parse()
         */
        var result = hxlColumn.match(/^\s*(#[A-Za-z][A-Za-z0-9_]*)((\s*\+[A-Za-z][A-Za-z0-9_]*)*)?\s*$/);
        var colAttributes = new Set();
        if (result) {
            if (result[2]) {
                // filter out empty values
                colAttributes = new Set(result[2].split(/\s*\+/).filter(function (attribute) { return attribute; }));
            }
            var columnTag = result[1];
            if (columnTag === this.tag && this.matchAttributes(colAttributes)) {
                return true;
            }
        }
        else {
            console.log('hxlColumn is empty');
        }
        return false;
    };
    Pattern.existingPatternMap = {};
    Pattern.matchingResultsMap = {};
    return Pattern;
}());
exports.Pattern = Pattern;
//# sourceMappingURL=pattern.js.map