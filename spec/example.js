import { Portfolio, Options } from '../src';

require('dotenv').config();

// const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN, { testMode: true });
// portfolio.getOrderHistory()
//   .then((orderHistory) => {
//     console.log(orderHistory);
//   });

const options = new Options(process.env.ROBINHOOD_TOKEN, { testMode: true });
options.getOrderHistory()
  .then(optionsPositions => {
    console.log(JSON.stringify(optionsPositions));
  });
