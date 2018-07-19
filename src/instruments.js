import Robinhood from './apis/robinhood';

export default class Instruments extends Robinhood {
  constructor(accessToken, instrumentType, {
    orderKeys, orderUniqueKey, orderKeyEquivalentInstrumentKey,
    instrumentURLKey, instrumentDetailsKeys,
    testMode = false,
  }) {
    super(accessToken, instrumentType, testMode);

    this.instrumentURLKey = instrumentURLKey;
    this.orderKeys = orderKeys;
    this.orderUniqueKey = orderUniqueKey;
    this.orderKeyEquivalentInstrumentKey = orderKeyEquivalentInstrumentKey;
    this.instrumentDetailsKeys = instrumentDetailsKeys;
  }

  async getOrderHistory(onlyFullRecords = true) {
    const orderHistory = await this.getDataFromAPI(this.orderKeys);
    const instrumentURLs = Array.from(new Set(orderHistory.map(order => order[this.instrumentURLKey])));
    const instrumentDetails = await this.batchRequest(instrumentURLs);

    const history = Instruments.mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, {
      orderKey: this.orderUniqueKey, instrumentKey: this.orderKeyEquivalentInstrumentKey,
    });

    if (!onlyFullRecords) return history;
    return history.filter(singleTrade => !Object.values(singleTrade).includes(null));
  }

  static mergeOrdersWithinstrumentDetails(orderHistory, instrumentDetails, { orderKey, instrumentKey }) {
    const instrumentHash = {};
    instrumentDetails.forEach((detail) => { instrumentHash[detail[instrumentKey]] = detail; });

    return orderHistory.map(order => ({
      side: order.type, // conflicts of fields in 2 data sets
      ...order,
      ...instrumentHash[order[orderKey]],
    }));
  }
}
