import Robinhood from "./robinhood";
import { readFileSync } from "fs";
import path from 'path';

export default class Options extends Robinhood {
  async get() {
    // fixme: get from real api
    const optionsPositions = readFileSync(path.resolve('test/robinhood.options.positions.json'), 'utf8');
    return JSON.parse(optionsPositions).results;
  }

  async positions() {
    const optionsRawData = await this.get();
    const filteredOptionsPositions = [];
    optionsRawData.forEach(optionRawDatum => {
      const { chain_symbol, type } = optionRawDatum;
      const quantity = parseInt(optionRawDatum.quantity);
      const average_price = parseFloat(optionRawDatum.average_price);

      if (quantity === 0) return;
      filteredOptionsPositions.push({ quantity, average_price, chain_symbol, type });
    });

    return filteredOptionsPositions;
  }
}
