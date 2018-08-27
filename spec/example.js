import { Portfolio } from '../src';

require('dotenv').config();

// testMode: request will be saved to .cached-fetch,
// and further request to the same path will be served from those cached file
// allowing reloading and testing interatively with no API limit from Robinhood
async function getAllOrderHistory() {
  const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN, { testMode: false });
  const orderHistory = await portfolio.getOrderHistory();
  console.log(JSON.stringify(orderHistory));
}

getAllOrderHistory();
