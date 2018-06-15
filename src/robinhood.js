export default class Robinhood {
  constructor(accessToken) {
    this.headers = { Authorization: `Token ${accessToken}` };
    this.robinhoodAPIs = {
      ordersAPI: 'https://api.robinhood.com/orders/'
    };
  }
}
