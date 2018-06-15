import { Portfolio } from '../src';

const portfolio = new Portfolio('d412cd251f791ab855fae75390c1b5c997043c96');
portfolio.get()
  .then(portfolio => {
    console.log(portfolio);
  })
  .catch(err => {
    console.error(err);
  });
