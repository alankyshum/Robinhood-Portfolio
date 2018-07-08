import fetch from 'node-fetch';
import Util from './util';
import Robinhood from './robinhood';

export default class Instruments extends Robinhood {
  constructor(accessToken, instrumentType, {
    orderKeys, orderUniqueKey, orderKeyEquivalentInstrumentKey,
    instrumentURLKey, instrumentDetailsKeys,
    testMode = false, requestBatchSize = 10,
  }) {
    super(accessToken, instrumentType, testMode);

    this.instrumentURLKey = instrumentURLKey;
    this.orderKeys = orderKeys;
    this.orderUniqueKey = orderUniqueKey;
    this.orderKeyEquivalentInstrumentKey = orderKeyEquivalentInstrumentKey;
    this.instrumentDetailsKeys = instrumentDetailsKeys;
    this.requestBatchSize = requestBatchSize;
  }

  async getOrderHistory() {
    const orderHistory = await this.getDataFromAPI(this.orderKeys);
    const stocksURLs = Array.from(new Set(orderHistory.map(order => order[this.instrumentURLKey])));
    const instrumentDetails = await this.getInstrumentDetails(stocksURLs);

    return Instruments.mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, {
      orderKey: this.orderUniqueKey, instrumentKey: this.orderKeyEquivalentInstrumentKey,
    });
  }

  async getInstrumentDetails(stocksURLs) {
    return this.batchRequest(stocksURLs, this.requestBatchSize);
  }

  async batchRequest(urls, batchSize, batchIndex = 0, results = []) {
    const sliceRange = [batchIndex * batchSize, ((batchIndex + 1) * batchSize)];
    const urlBatch = urls.slice(...sliceRange);
    const batchPromise = urlBatch.map(async (url) => {
      const fetchResponse = await fetch(url, { methods: 'GET' });
      const rawResponse = await fetchResponse.json();
      return Util.filteredHash(rawResponse, this.instrumentDetailsKeys);
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

  static mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, { orderKey, instrumentKey }) {
    const instrumentHash = {};
    instrumentDetails.forEach((detail) => { instrumentHash[detail[instrumentKey]] = detail; });

    return orderHistory.map(order => ({
      ...order,
      ...instrumentHash[order[orderKey]],
    }));
  }
}
