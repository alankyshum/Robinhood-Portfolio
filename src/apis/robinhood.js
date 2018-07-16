import Fetcher from './fetcher';

export default class Robinhood {
  BATCH_REQUEST_SIZE = 10;
  ROBINHOOD_APIS = {
    orders: 'https://api.robinhood.com/orders/',
    options: 'https://api.robinhood.com/options/positions',
  };

  constructor(accessToken, apiType, testMode = false) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.apiURL = this.ROBINHOOD_APIS[apiType];
    this.fetcher = new Fetcher({ testMode });
  }

  async getDataFromAPI(resultFields) {
    return this.getPagedResults(this.apiURL, 'next', resultFields);
  }

  async getPagedResults(pageURL, nextPageField, resultFields, results = []) {
    const rawResponse = await this.fetcher.fetch(pageURL, { methods: 'POST', headers: this.headers });
    const pageResult = rawResponse.results.map(responseResult => Robinhood.filteredHash(responseResult, resultFields));
    const apendedResults = [...results, ...pageResult];
    const nextPageURL = rawResponse[nextPageField];
    if (nextPageURL) {
      return this.getPagedResults(nextPageURL, nextPageField, resultFields, apendedResults);
    }

    return apendedResults;
  }

  async batchRequest(urls, batchIndex = 0, results = []) {
    const urlBatch = urls.slice(batchIndex * this.BATCH_REQUEST_SIZE, ((batchIndex + 1) * this.BATCH_REQUEST_SIZE));
    const batchPromise = urlBatch.map(async (url) => {
      const rawResponse = await this.fetcher.fetch(url, { methods: 'GET' });
      return Robinhood.filteredHash(rawResponse, this.instrumentDetailsKeys);
    });

    const batchResults = await Promise.all(batchPromise);
    const appendedResults = [...results, ...batchResults];

    const nextBatchIndex = batchIndex + 1;
    const lastIndex = urls.length - 1;
    if (nextBatchIndex * this.BATCH_REQUEST_SIZE <= lastIndex) {
      return this.batchRequest(urls, nextBatchIndex, appendedResults);
    }

    return appendedResults;
  }

  static filteredHash(srcHash, fields) {
    const filteredObject = {};
    fields.forEach((field) => { filteredObject[field] = srcHash[field]; });

    return filteredObject;
  }
}
