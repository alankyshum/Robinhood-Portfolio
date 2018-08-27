# Robinhood Portfolio
> Simply returns your Robinhood portfolio, with stock symbols, stock full name, and average buy price

## Installation
```bash
npm install robinhood-portfolio
```

## Usage
1. Create/Edit the `.env` to provide the robinhood access token
    ```bash
    ROBINHOOD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```
1. Refer to `spec/example.js` for example API
    * Alway refer to the example file for the most updated version
    ```javascript
    const portfolio = new Portfolio(process.env.ROBINHOOD_TOKEN, { testMode: false });
    const orderHistory = await portfolio.getOrderHistory();
    ```

## Development
```bash
npm run build
npm link
cd <path-to-project-that-tests-this-package>
npm link robinhood-portfolio
# import { Portfolio } from 'robinhood-portfolio;
```

## Versioning
The versioning of this package follows semantic versioning `MAJOR.MINOR.PATCH`.

## References
1. [Unofficial Documentation of Robinhood Trade's Private API](https://github.com/sanko/Robinhood/blob/ef63649f5d316e10f672c4d588a79cf0387c97df/README.md)
