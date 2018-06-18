// import fetch from 'node-fetch';
import Robinhood from './robinhood';

export default class Portfolio extends Robinhood {
  constructor(accessToken) {
    super(accessToken, 'orders');
  }

  async get() {
    const orderHistory = await this.getDataFromAPI('next', ['instrument', 'quantity', 'average_price', 'side', 'last_transaction_at']);
    // TODO: integrate instrument chain symbol
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
