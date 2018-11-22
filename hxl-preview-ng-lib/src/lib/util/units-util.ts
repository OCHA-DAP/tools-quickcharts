export class UnitsUtil {
  public static computeBiteUnit(value: number): string {
    let unit = null;
    if (value > 1000000000.0) {
      unit = 'bln';
    } else if (value > 1000000.0) {
      unit = 'mln';
    } else if (value > 1000.0) {
      unit = 'k';
    }
    return unit;
  }

  public static transform(value: number, format: string, unit: string): string {
    const modifiedValue = UnitsUtil.computeValueBasedOnUnit(value, unit);
    if (format) {
      return modifiedValue.toLocaleString(format);
    }
    return modifiedValue + '';
  }

  private static computeValueBasedOnUnit(value: number, unit: string): number {
    if (unit) {
      let newValue = value;
      switch (unit) {
        case 'k':
          newValue = newValue / 1000.0 ;
          break;
        case 'mln':
          newValue = newValue / 1000000.0 ;
          break;
        case 'bln':
          newValue = newValue / 1000000000.0 ;
          break;
      }
      /* Keep only one decimal value  */
      return Math.round(newValue * 10.0) / 10.0;
    }

    return value;
  }
}
