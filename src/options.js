import Instruments from './instruments';
import Robinhood from './robinhood';

export default class Options extends Robinhood {
  constructor(accessToken, { testMode }) {
    super(accessToken, 'options', testMode);
  }

  async getOrderHistory() {
    const orderHistory = await this.getDataFromAPI('next', ['chain_symbol', 'type', 'quantity', 'average_price', 'option', 'updated_at']);
    const instruments = new Instruments(orderHistory, {
      instrumentURLKey: 'option',
      instrumentDetailsKeys: ['chain_symbol', 'type', 'strike_price', 'expiration_date', 'state'],
    });
    const instrumentDetails = await instruments.getInstrumentDetails();
    return Options.mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, {
      orderKey: 'chain_symbol', instrumentKey: 'chain_symbol',
    });
  }

  static mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, { orderKey, instrumentKey }) {
    const instrumentHash = {};

    instrumentDetails.forEach((detail) => {
      instrumentHash[detail[instrumentKey]] = detail;
    });

    return orderHistory.map(order => ({
      ...order,
      ...instrumentHash[order[orderKey]],
    }));
  }
}
