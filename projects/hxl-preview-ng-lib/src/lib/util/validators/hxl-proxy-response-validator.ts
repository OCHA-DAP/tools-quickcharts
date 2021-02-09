export class NoDataBodyInHxlResponseError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'NoDataBodyInHxlResponseError';
  }
}

export class HxlProxyResponseValidator {
  constructor(public hxlData: any) {};

  check(): boolean {
    if (!this.hxlData) {
      throw new Error('No data returned by the HXL Proxy');
    } else if (!Array.isArray(this.hxlData)) {
      let message = 'There was a problem with the data returned from the HXL Proxy';
      if (this.hxlData.error) {
        message += ` - error: ${this.hxlData.error}`;
      }
      if (this.hxlData.message) {
        message += ` - message: ${this.hxlData.message}`;
      }
      throw new Error(message);
    } else if (this.hxlData.length < 2) {
      throw new Error('Only 1 row was returned from HXL Proxy. Not a complete header.');
    } else if (this.hxlData.length === 2) {
      const message =
          'The data source doesn\'t contain the values needed for this visualization.';
      throw new NoDataBodyInHxlResponseError(message);
    }
    return true;
  }
}

