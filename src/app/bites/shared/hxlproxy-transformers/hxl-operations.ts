export abstract class BasicRecipe {
  constructor(public filter: string) {}

}

class CountRecipe extends BasicRecipe {
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
  constructor(public tags: string) {
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
  constructor(valueCol: string, aggCols: string[], operation: string) {
    let aggColumns: any[];
    if ( aggCols && aggCols.length > 0 ) {
      aggColumns = aggCols.filter( (value: string) => Boolean(value) );
    }
    if (aggColumns.length === 0) {
      aggColumns.push('#fake_column');
    }
    const operations = [`${operation}(${valueCol})`];
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
  constructor(col: string) {
    super(new SortRecipe(col));
  }
}

export class FilterOperation extends  AbstractOperation {
  /**
   * Filter operation (only based on one column for now)
   * @param valueColumn The column on which the conditions will be applied
   * @param filteredValues the value which should be filtered out
   */
  constructor(valueColumn: string, filteredValues: number[]) {
    const filterConditions: string[] = [];
    filteredValues.forEach( num => filterConditions.push(`${valueColumn}=${num}`) );
    super(new WithoutRowsRecipe(filterConditions));
  }
}
