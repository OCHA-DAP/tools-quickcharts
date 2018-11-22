import { SpecialFilterValues } from './hxl-operations';
import { HxlFilter } from '../../types/ingredients';

export type SpecialFilterValues = { [s: string]: string; };

export abstract class BasicRecipe {
  constructor(public filter: string) {}

}

export class CountRecipe extends BasicRecipe {
  /**
   *
   * @param patterns column names to aggregate by
   * @param aggregators the operations and respective columns. ex: ["sum(#targeted) as Total targeted#targeted+total"]
   */
  constructor(public patterns: string[], public aggregators: string[]) {
    super('count');
  }
}

class RenameRecipe extends BasicRecipe {
  /**
   *
   * @param specs string containing old and new tag (plus optional header) #old_tagspec:New header#new_tagspec
   */
  constructor(public specs: string) {
    super('rename_columns');
  }
}

class CutRecipe extends BasicRecipe {
  /**
   *
   * @param whitelist Tag patterns for the columns to include
   */
  constructor(public whitelist: string[]) {
    super('with_columns');
  }
}

class CleanRecipe extends BasicRecipe {
  /**
   *
   * @param date Tag that contains dates to clean
   */
  constructor(public date: string) {
    super('clean_data');
  }
}

class SortRecipe extends BasicRecipe {
  /**
   *
   * @param tags comma separated tags by which to sort
   */
  constructor(public tags: string, public reverse: boolean) {
    super('sort');
  }
}

class WithoutRowsRecipe extends BasicRecipe {
  /**
   *
   * @param queries list of conditions like "date+year>2010"
   */
  constructor(public queries: string[]) {
    super('without_rows');
  }
}

class WithRowsRecipe extends BasicRecipe {
  /**
   *
   * @param queries list of conditions like "date+year>2010"
   */
  constructor(public queries: string[]) {
    super('with_rows');
  }
}

export abstract class AbstractOperation {
  protected readonly _recipe: BasicRecipe;

  constructor(_recipe: BasicRecipe) {
    this._recipe = _recipe;
  }

  get recipe() {
    return this._recipe;
  }
}

export class CountOperation extends AbstractOperation {
  constructor(valueCols: string[], aggCols: string[], operation: string) {
    let aggColumns: any[] = [];
    if ( aggCols && aggCols.length > 0 ) {
      aggColumns = aggCols.filter( (value: string) => Boolean(value) );
    }
    if (aggColumns.length === 0) {
      aggColumns.push('#fake_column');
    }
    const operations: string[] = valueCols.map(valueCol => `${operation}(${valueCol}) as ${valueCol ? valueCol : '#meta+count'}`);
    super(new CountRecipe(aggColumns, operations));
  }

}

export class RenameOperation extends AbstractOperation {
  constructor(oldTag: string, newTag: string, newHeader: string) {
    const myNewHeader = newHeader ? newHeader : '';
    super(new RenameRecipe(`${oldTag}:${myNewHeader}${newTag}`));
  }
}

export class CutOperation extends AbstractOperation {
  constructor(valueCol: string, aggCols: string[]) {
    let keepList = [valueCol];
    if (aggCols) {
      keepList = keepList.concat(aggCols.filter( (value: string) => Boolean(value) ));
    }
    super(new CutRecipe(keepList));
  }
}

export class CleanOperation extends  AbstractOperation {
  constructor(dateCol: string) {
    super(new CleanRecipe(dateCol));
  }
}

export class SortOperation extends  AbstractOperation {
  constructor(col: string, reverse?: boolean) {
    reverse = reverse ? reverse : false;
    super(new SortRecipe(col, reverse));
  }
}

export class FilterOperation extends  AbstractOperation {
  /**
   * Filter operation (only based on one column for now)
   * @param filters list of filters from hxl recipe  (@see HxlFilter)
   * @param isWithFilter true if the records matching the filter should be kept, false otherwise
   * @param specialFilterValues dictionary with values for min, max, etc
   */
  constructor(filters: HxlFilter[], isWithFilter: boolean, specialFilterValues: SpecialFilterValues) {
    const filterConditions: string[] = [];
    filters.forEach( pair => {
      const column = Object.keys(pair)[0];
      let value = pair[column];
      const key = `${column}-${value}`;

      if (specialFilterValues[key]) {
        value = specialFilterValues[key];
      }
      filterConditions.push(`${column}=${value}`);
    });
    if (isWithFilter) {
      super(new WithRowsRecipe(filterConditions));
    } else {
      super(new WithoutRowsRecipe(filterConditions));
    }
  }
}
