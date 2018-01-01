# Robinhood portfolio on Finviz
  > View technical charts for all the stocks you have bought on Robinhood, and synchrionised

## How does it work?
### `robinhood-portfolio.js`
1. Get Robinhood Access Token (from `window` API)
    - `window.robinhoodPortfolio.robinhoodAccessToken`
1. Get the order histroy from Robinhood API
1. Request for stock symbols
    1. Cache them in `window.localStorage`
1. Redirect current [finviz.com](http://www.finviz.com) to load charts for your portfolio

### `bookmarklet.js`
1. Expose AccessToken to browser
1. Bookmark the script as bookmarklet
    - load the script from URL bar
1. When browing [finviz.com](http://www.finviz.com), type on the url bar for the bookmarklet name
1. Tap to run the script

## Benefits of doing this
1. Works on all modern browsers without any extensions
    - This could be written as extension, but that limits to desktop browser only.
    - Bookmarklet requires
