const robinhoodPortfolio = require('./');

const portfolio = new robinhoodPortfolio('YOUR_ACCESS_TOKEN_HERE');
portfolio.get()
  .then(portfolio => {
    console.log(portfolio);
  });
