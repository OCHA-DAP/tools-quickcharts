export abstract class BasicRecipe {
  constructor(public filter: string){}

}

class CountRecipe extends BasicRecipe {
  /**
   *
   * @param patterns column names to aggregate by
   * @param aggregate_pattern column that will be aggregated
   */
  constructor(public patterns: string[], public aggregate_pattern: string) {
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
  constructor(valueCol: string, aggCols: string[]) {
    let aggColumns = ['#fake_column'];
    if ( aggCols && aggCols.length > 0 ) {
      aggColumns = aggCols;
    }

    super(new CountRecipe(aggColumns, valueCol));
  }

}

export class RenameOperation extends AbstractOperation {
  constructor(oldTag: string, newTag: string, newHeader: string) {
    let myNewHeader = newHeader ? newHeader : '';
    super(new RenameRecipe(`${oldTag}:${myNewHeader}${newTag}`));
  }
}

export class CutOperation extends AbstractOperation {
  constructor(valueCol: string, aggCols: string[]) {
    let keepList = [valueCol];
    if (aggCols) {
      keepList = keepList.concat(aggCols);
    }
    super(new CutRecipe(keepList));
  }
}
