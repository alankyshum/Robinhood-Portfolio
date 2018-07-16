import Portfolio from '../src/portfolio';

require('dotenv').config();

// testMode: request will be saved to .cached-fetch,
// and further request to the same path will be served from those cached file
// allowing reloading and testing interatively without API limit from Robinhood
// const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN);
const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN, { testMode: true });
portfolio.getOrderHistory()
  .then((orderHistory) => {
    console.log(JSON.stringify(orderHistory));
  });
