# Robinhood Portfolio
> Simply returns your Robinhood portfolio, with stock symbols, stock full name, and average buy price

## Example
```javascript
const portfolio = new robinhoodPortfolio('YOUR_ACCESS_TOKEN_HERE');

portfolio.get()
  .then(portfolio => {
    console.log(portfolio);
  });
```
