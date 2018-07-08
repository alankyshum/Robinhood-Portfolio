import Portfolio from '../src/portfolio';

require('dotenv').config();

const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN, {});
portfolio.getOrderHistory()
  .then((orderHistory) => {
    console.log(JSON.stringify(orderHistory));
  });
