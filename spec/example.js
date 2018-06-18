import { Portfolio } from '../src';

require('dotenv').config();

const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN);
portfolio.get();

// const options = new Options(process.env.ROBINHOOD_TOKEN);
// const positions = options.get()
//   .then(positions => {
//     console.log(positions);
//   });
