import Instruments from './instruments';

export default class Portfolio {
  constructor(accessToken, { testMode = false }) {
    this.orders = new Instruments(accessToken, 'orders', {
      orderKeys: ['instrument', 'quantity', 'average_price', 'side', 'last_transaction_at'],
      orderUniqueKey: 'instrument',
      orderKeyEquivalentInstrumentKey: 'url',
      instrumentURLKey: 'instrument',
      instrumentDetailsKeys: ['name', 'symbol', 'country', 'url'],
      testMode,
    });

    this.options = new Instruments(accessToken, 'options', {
      orderKeys: ['chain_symbol', 'closing_strategy', 'quantity', 'price', 'option=legs[0].option', 'updated_at'],
      orderUniqueKey: 'chain_symbol',
      orderKeyEquivalentInstrumentKey: 'chain_symbol',
      instrumentURLKey: 'option',
      instrumentDetailsKeys: ['chain_symbol', 'type', 'strike_price', 'expiration_date', 'state'],
      testMode,
    });
  }

  async getOrderHistory() {
    const orderHistory = await Promise.all([
      this.orders.getOrderHistory(),
      this.options.getOrderHistory(),
    ]);

    return {
      orders: orderHistory[0],
      options: orderHistory[1],
    };
  }
}
