import { Portfolio, Options } from '../src';
require('dot-env').config();

const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN);
portfolio.get()
  .then(portfolio => {
    console.log(portfolio);
  })

const options = new Options(process.env.ROBINHOOD_TOKEN);
const positions = options.get()
  .then(positions => {
    console.log(positions);
  });
