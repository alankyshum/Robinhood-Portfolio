import fetch from 'node-fetch';
import Util from './util';
import MockData from './mock-data';

export default class Robinhood {
  apiURL = null;
  apiType = null;
  testMode = false;

  ROBINHOOD_APIS = {
    orders: 'https://api.robinhood.com/orders/',
    options: 'https://api.robinhood.com/options/positions',
  };

  constructor(accessToken, apiType, testMode = false) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.apiURL = this.ROBINHOOD_APIS[apiType];
    this.apiType = apiType;
    this.testMode = testMode;
  }

  async getDataFromAPI(resultFields) {
    if (!this.testMode) return this.getPagedResults(this.apiURL, 'next', resultFields);

    const mockData = new MockData(this.apiType);
    return mockData.getMockData();
  }

  async getPagedResults(pageURL, nextPageField, resultFields, results = []) {
    const fetchResponse = await fetch(pageURL, { methods: 'POST', headers: this.headers });
    const rawResponse = await fetchResponse.json();
    const pageResult = rawResponse.results.map(responseResult => Util.filteredHash(responseResult, resultFields));
    const apendedResults = [...results, ...pageResult];
    const nextPageURL = rawResponse[nextPageField];
    if (nextPageURL) {
      return this.getPagedResults(nextPageURL, nextPageField, resultFields, apendedResults);
    }

    return apendedResults;
  }
}
