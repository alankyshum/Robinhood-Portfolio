import fetch from 'node-fetch';
import Util from './util';

export default class Robinhood {
  API_URL = null;

  ROBINHOOD_APIS = {
    orders: 'https://api.robinhood.com/orders/',
    options: 'https://api.robinhood.com/options/positions',
  };

  constructor(accessToken, APIType) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.API_URL = this.ROBINHOOD_APIS[APIType];
  }

  async getDataFromAPI(nextPageField, resultFields) {
    return this.getPagedResults(this.API_URL, nextPageField, resultFields);
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
