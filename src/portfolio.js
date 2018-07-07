import Robinhood from './robinhood';
import Instruments from './instruments';

export default class Portfolio extends Robinhood {
  constructor(accessToken, { testMode }) {
    super(accessToken, 'orders', testMode);
  }

  async getOrderHistory() {
    const orderHistory = await this.getDataFromAPI('next', ['instrument', 'quantity', 'average_price', 'side', 'last_transaction_at']);
    const instruments = new Instruments(orderHistory, {
      instrumentURLKey: 'instrument',
      instrumentDetailsKeys: ['name', 'symbol', 'country', 'url'],
    });
    const instrumentDetails = await instruments.getInstrumentDetails();
    return Portfolio.mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails);
  }

  static mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails) {
    const instrumentHash = {};

    instrumentDetails.forEach((detail) => {
      instrumentHash[detail.url] = {
        name: detail.name,
        symbol: detail.symbol,
        country: detail.country,
      };
    });

    return orderHistory.map(order => ({
      ...order,
      ...instrumentHash[order.instrument],
    }));
  }
}
