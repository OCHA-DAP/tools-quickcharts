/**
 * Mostly based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js
 */
export class Pattern {

  private static existingPatternMap: { [s: string]: Pattern; } = {};
  private static matchingResultsMap: { [s: string]: boolean; } = {};

  private includeAttributes = new Set<string>();
  private excludeAttributes = new Set<string>();
  private tag: string;

  public static matchPatternToColumn(hxlPattern: string, hxlColumn: string): boolean {
    if (hxlPattern && hxlPattern.trim() && hxlColumn && hxlColumn.trim()) {
      hxlPattern = hxlPattern.trim();
      hxlColumn = hxlColumn.trim();
      const key = `${hxlPattern}-${hxlColumn}`;
      let result = Pattern.matchingResultsMap[key];
      if (!result && result !== false) {
        const pattern = Pattern.parse(hxlPattern);
        result = pattern.matchHxlColumn(hxlColumn);
        Pattern.matchingResultsMap[key] = result;
        // console.log(`Match computed for ${key} -> ${result}`);
      } else {
        // console.log(`Match result found in cache for ${key} -> ${result}`);
      }
      return result;
    } else if (!hxlColumn || !hxlColumn.trim()) {
      return false;
    }
    throw new Error('hxlPattern should not be empty');
  }

  private static parse(hxlPattern: string) {
    hxlPattern = hxlPattern.trim();
    let pattern = Pattern.existingPatternMap[hxlPattern];
    if (!pattern) {
      pattern = new Pattern(hxlPattern);
      Pattern.existingPatternMap[hxlPattern] = pattern;
    }
    return pattern;
  }

  /**
   * Based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js hxl.classes.Pattern.parse()
   * @param hxlPattern
   */
  private constructor(hxlPattern: string) {


    const result = String(hxlPattern).match(/^\s*#?([A-Za-z][A-Za-z0-9_]*)((?:\s*[+-][A-Za-z][A-Za-z0-9_]*)*)\s*$/);
    if (result) {
      const attributeSpecs = result[2].split(/\s*([+-])/).filter(function (item) { return item; });
      for (let i = 0; i < attributeSpecs.length; i += 2) {
        if (attributeSpecs[i] === '+') {
          this.includeAttributes.add(attributeSpecs[i + 1]);
        } else {
          this.excludeAttributes.add(attributeSpecs[i + 1]);
        }
      }
      this.tag = '#' + result[1];
    }
  }

  private matchAttributes(colAttributes: Set<string>): boolean {
    let attributesMatch = true;
    this.includeAttributes.forEach(inclAttribute => {
      if (!colAttributes.has(inclAttribute)) {
        attributesMatch = false;
      }
    });

    if (attributesMatch) {
      this.excludeAttributes.forEach(exclAttribute => {
        if (colAttributes.has(exclAttribute)) {
          attributesMatch = false;
        }
      });
    }
    return attributesMatch;
  }

  private matchHxlColumn(hxlColumn: string): boolean {
    /**
     * Based on https://github.com/HXLStandard/libhxl-js/blob/master/hxl.js hxl.classes.Column.parse()
     */
    const result = hxlColumn.match(/^\s*(#[A-Za-z][A-Za-z0-9_]*)((\s*\+[A-Za-z][A-Za-z0-9_]*)*)?\s*$/);
    let colAttributes: Set<string> = new Set<string>();
    if (result) {
        if (result[2]) {
            // filter out empty values
            colAttributes = new Set(result[2].split(/\s*\+/).filter(function(attribute) { return attribute; }));
        }
        let columnTag = result[1];
        if (columnTag === this.tag && this.matchAttributes(colAttributes)) {
          return true;
        }

    } else {
      console.log('hxlColumn is empty');
    }
    return false;
  }
}
