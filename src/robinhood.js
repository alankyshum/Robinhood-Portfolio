import fetch from 'node-fetch';

export default class Robinhood {
  BATCH_REQUEST_SIZE = 10;
  ROBINHOOD_APIS = {
    orders: 'https://api.robinhood.com/orders/',
    options: 'https://api.robinhood.com/options/positions',
  };

  constructor(accessToken, apiType, testMode = false) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.apiURL = this.ROBINHOOD_APIS[apiType];
    this.testMode = testMode;
  }

  async getDataFromAPI(resultFields) {
    return this.getPagedResults(this.apiURL, 'next', resultFields);
  }

  async getPagedResults(pageURL, nextPageField, resultFields, results = []) {
    const fetchResponse = await fetch(pageURL, { methods: 'POST', headers: this.headers });
    const rawResponse = await fetchResponse.json();
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
      const fetchResponse = await fetch(url, { methods: 'GET' });
      const rawResponse = await fetchResponse.json();
      return Robinhood.filteredHash(rawResponse, this.instrumentDetailsKeys);
    });

    const batchResults = await Promise.all(batchPromise);
    const appendedResults = [...results, ...batchResults];

    const nextBatchIndex = batchIndex + 1;
    const lastIndex = urls.length - 1;
    if (nextBatchIndex * this.BATCH_REQUEST_SIZE <= lastIndex) {
      return this.batchRequest(urls, this.BATCH_REQUEST_SIZE, nextBatchIndex, appendedResults);
    }

    return appendedResults;
  }

  static filteredHash(srcHash, fields) {
    const filteredObject = {};
    fields.forEach((field) => { filteredObject[field] = srcHash[field]; });

    return filteredObject;
  }
}
