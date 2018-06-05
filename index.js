const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

module.exports = class RobinhoodPortfolio {
  constructor(accessToken) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.robinhoodAPIs = {
      ordersAPI: 'https://api.robinhood.com/orders/'
    };
  }

  async get() {
    const self = this;
    return await self.getOrderHistory()
      .then(positionsURLs => positionsURLs.map((positionsURL) => self.getPositionData(positionsURL)))
      .then(portfoliosPromiseArray => Promise.all(portfoliosPromiseArray))
      .then(self.portfolioWithInstrumentsInfo)
  }

  async getOrderHistory() {
    console.log('Getting Order History');
    return await this.getPositionURLs(this.robinhoodAPIs.ordersAPI);
  }

  async getPositionURLs(positionPage) {
    const headers = this.headers;
    const positionURLS = new Set();

    while (positionPage) {
      const fetchResult = await fetch(positionPage, {
        methods: 'POST',
        headers
      })
      const positionDataResponse = await fetchResult.json();
      if (!positionDataResponse.results) return [];

      positionDataResponse.results.forEach(order => {
        console.log(`Getting Position from: ${order.position}`);
        positionURLS.add(order.position);
      });
      positionPage = positionDataResponse.next;
    }

    return Array.from(positionURLS);
  }

  getPositionData(positionsURL) {
    const headers = this.headers;
    return new Promise((resolve, reject) => {
      fetch(positionsURL, { method: 'GET', headers })
        .then(res => res.json())
        .then(positionData => {
          console.log(`Getting info for position for: ${positionData.instrument}`);
          resolve({
            instrumentURL: positionData.instrument,
            quantity: parseInt(positionData.quantity),
            averagePrice: parseFloat(positionData.average_buy_price)
          });
        });
    });
  }

  async portfolioWithInstrumentsInfo(instruments) {
    const portfolio = {};
    const fetchResults = [];

    for (const instrument of instruments) {
      const fetchResult = await fetch(instrument.instrumentURL, { method: 'GET' })
        .then(res => res.json())
        .then(response => {
          console.log(`Getting info for ${response.name}`);

          const instrumentInfo = {
            name: response.name,
            country: response.country
          };

          portfolio[response.symbol] = {...instrumentInfo, ...instrument};
        });

      fetchResults.push(fetchResult);
    }

    return portfolio;
  }
}

