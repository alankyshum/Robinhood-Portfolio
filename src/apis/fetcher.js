import fetch from 'node-fetch';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

export default class Fetcher {
  CACHED_FETCH = path.resolve('./.cached-fetch');

  constructor({ testMode }) {
    this.testMode = testMode;
  }

  async fetch(requestedPath, options) {
    if (!this.testMode) {
      const fetchResponse = await fetch(requestedPath, options);
      return fetchResponse.json();
    }

    const cachedFilePath = `${path.join(this.CACHED_FETCH, Fetcher.requestPathToFilePath(requestedPath))}.json`;

    let cacheExists = true;
    let cachedResponse;
    try {
      cachedResponse = readFileSync(cachedFilePath, 'utf-8');
    } catch (e) {
      if (e.code === 'ENOENT') { cacheExists = false; }
    }

    if (cacheExists) { return Promise.resolve(JSON.parse(cachedResponse)); }

    const fetchResponse = await fetch(requestedPath, options);
    const responseJSON = await fetchResponse.json();
    writeFileSync(cachedFilePath, JSON.stringify(responseJSON), { flag: 'w' });
    return Promise.resolve(responseJSON);
  }

  static requestPathToFilePath(requestedPath) {
    return requestedPath.replace(/\/|\\|:/g, '_');
  }
}
