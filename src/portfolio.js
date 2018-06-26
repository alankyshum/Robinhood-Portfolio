import fetch from 'node-fetch';
import Robinhood from './robinhood';

export default class Portfolio extends Robinhood {
  constructor(accessToken) {
    super(accessToken, 'orders');
  }

  async getOrderHistory() {
    const orderHistory = await this.getDataFromAPI('next', ['instrument', 'quantity', 'average_price', 'side', 'last_transaction_at']);
    return this.mapInstrument(orderHistory);
  }

  async mapInstrument(orderHistory) {
    const stocksURLs = Array.from(new Set(orderHistory.map(order => order.instrument)));
    const batchSize = 10;
    const instrumentDetails = await this.batchRequest(stocksURLs, batchSize);
    return Portfolio.mergeOrdersWithInstrumentDetails(orderHistory, instrumentDetails);
  }

  async batchRequest(urls, batchSize, batchIndex = 0, results = []) {
    const sliceRange = [batchIndex * batchSize, ((batchIndex + 1) * batchSize)];
    const urlBatch = urls.slice(...sliceRange);
    const batchPromise = urlBatch.map(async (url) => {
      const fetchResponse = await fetch(url, { methods: 'GET' });
      const rawResponse = await fetchResponse.json();
      return Robinhood.filteredHash(rawResponse, ['name', 'symbol', 'country', 'url']);
    });

    const batchResults = await Promise.all(batchPromise);
    const appendedResults = [...results, ...batchResults];

    const nextBatchIndex = batchIndex + 1;
    const lastIndex = urls.length - 1;
    if (nextBatchIndex * batchSize <= lastIndex) {
      return this.batchRequest(urls, batchSize, nextBatchIndex, appendedResults);
    }

    return appendedResults;
  }

  static mergeOrdersWithInstrumentDetails(orderHistory, instrumentDetails) {
    const instrumentHash = {};

    instrumentDetails.forEach((detail) => {
      instrumentHash[detail.url] = {
        name: detail.name,
        symbol: detail.symbol,
        country: detail.country,
      };
    });

    return orderHistory.map(order => ({
      ...order,
      ...instrumentHash[order.instrument],
    }));
  }
}
