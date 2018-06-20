import fetch from 'node-fetch';
import fs from 'fs';
import Robinhood from './robinhood';

export default class Portfolio extends Robinhood {
  constructor(accessToken) {
    super(accessToken, 'orders');
  }

  async get() {
    // const orderHistory = await this.getDataFromAPI('next', ['instrument', 'quantity', 'average_price', 'side', 'last_transaction_at']);
    const orderHistory = await fs.readFile('test/robinhood.orderhistory.json');
    this.mapInstrument(orderHistory);
  }

  async mapInstrument(orderHistory) {
    const stocksURLs = Array.from(new Set(orderHistory.map(order => order.instrument)));
    const batchSize = 10;
    return this.batchRequest(stocksURLs, batchSize);
  }

  async batchRequest(urls, batchSize, batchIndex = 0, results = []) {
    const batchPromise = urls.map(async (url) => {
      const fetchResponse = await fetch(url, { methods: 'GET' });
      const rawResponse = await fetchResponse.json();
      return this.filteredHash(rawResponse, ['name', 'symbol', 'country']);
    });

    const batchResults = await Promise.all(batchPromise);
    const appendedResults = [...results, ...batchResults];

    const nextBatchIndex = batchIndex;
    const nextBatchUrlSet = urls.splice(nextBatchIndex * batchSize, batchSize);
    if (nextBatchUrlSet.length) {
      return this.batchRequest(nextBatchUrlSet, batchSize, nextBatchIndex, appendedResults);
    }

    return results;
  }

  // async portfolioWithInstrumentsInfo(instruments) {
  //   const portfolio = {};
  //   const fetchResults = [];

  //   for (const instrument of instruments) {
  //     const fetchResult = await fetch(instrument.instrumentURL, { method: 'GET' })
  //       .then(res => res.json())
  //       .then(response => {
  //         console.log(`Getting info for ${response.name}`);

  //         const instrumentInfo = {
  //           name: response.name,
  //           country: response.country
  //         };

  //         portfolio[response.symbol] = {...instrumentInfo, ...instrument};
  //       });

  //     fetchResults.push(fetchResult);
  //   }

  //   return portfolio;
  // }
}
