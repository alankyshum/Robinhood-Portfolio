import { readFileSync } from 'fs';
import path from 'path';

export default class MockData {
  constructor(apiType) {
    this.mockDataFile = {
      options: 'robinhood.options.positions.json',
      orders: 'robinhood.orderhistory.json',
    }[apiType];
  }

  getMockData() {
    return Promise.resolve(JSON.parse(readFileSync(path.resolve(`test/${this.mockDataFile}`), 'utf-8')));
  }
}
