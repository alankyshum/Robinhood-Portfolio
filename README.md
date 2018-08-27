# Robinhood Portfolio
> Simply returns your Robinhood portfolio, with stock symbols, stock full name, and average buy price

## Installation
```bash
npm install robinhood-portfolio
```

## Development
```bash
npm run build
npm link
cd <path-to-project-that-tests-this-package>
npm link robinhood-portfolio
# import { Portfolio } from 'robinhood-portfolio;
```

## Example
1. Create/Edit the `.env` to supply the robinhood access token
    ```bash
    ROBINHOOD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```
1. Refer to `spec/example.js` for example API

## Versioning
The versioning of this package follows semantic versioning `MAJOR.MINOR.PATCH`.

## References
1. [Unofficial Documentation of Robinhood Trade's Private API](https://github.com/sanko/Robinhood/blob/ef63649f5d316e10f672c4d588a79cf0387c97df/README.md)
