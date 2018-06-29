import fetch from 'node-fetch';
import Util from './util';

export default class Instruments {
  defaultOptions = {
    requestBatchSize: 10,
  }

  constructor(orderHistory, options) {
    this.orderHistory = orderHistory;
    this.options = { ...this.defaultOptions, ...options };
  }

  async getInstrumentDetails() {
    const stocksURLs = Array.from(new Set(this.orderHistory.map(order => order[this.options.instrumentURLKey])));
    return this.batchRequest(stocksURLs, this.options.requestBatchSize);
  }

  async batchRequest(urls, batchSize, batchIndex = 0, results = []) {
    const sliceRange = [batchIndex * batchSize, ((batchIndex + 1) * batchSize)];
    const urlBatch = urls.slice(...sliceRange);
    const batchPromise = urlBatch.map(async (url) => {
      const fetchResponse = await fetch(url, { methods: 'GET' });
      const rawResponse = await fetchResponse.json();
      return Util.filteredHash(rawResponse, this.options.instrumentDetailsKeys);
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
}
