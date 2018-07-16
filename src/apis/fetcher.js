import fetch from 'node-fetch';
import path from 'path';
import { promisify } from 'util';
import { existsSync, readFileSync, mkdir, writeFileSync } from 'fs';

export default class Fetcher {
  constructor({ testMode }) {
    this.testMode = testMode;
  }

  async fetch(requestedPath, options) {
    if (!this.testMode) {
      const fetchResponse = await fetch(requestedPath, options);
      return fetchResponse.json();
    }

    const cachedResponse = Fetcher.getCachedResponse(requestedPath);
    if (cachedResponse) return Promise.resolve(cachedResponse);
    return Fetcher.fetchAndCache(requestedPath, options);
  }

  static async fetchAndCache(requestedPath, options) {
    const cachedFilePath = Fetcher.getCachedPath(requestedPath);
    const fetchResponsePromise = fetch(requestedPath, options).then(r => r.json());
    const cacheFolderExists = existsSync(cachedFilePath.folder);
    const createFilePromise = cacheFolderExists ? Promise.resolve(true) : promisify(mkdir)(cachedFilePath.folder);
    const dataAndFileReady = await Promise.all([fetchResponsePromise, createFilePromise]);
    writeFileSync(cachedFilePath.fileName, JSON.stringify(dataAndFileReady[0]));
    return Promise.resolve(dataAndFileReady[0]);
  }

  static getCachedResponse(requestedPath) {
    const cachedFilePath = Fetcher.getCachedPath(requestedPath);
    if (!existsSync(cachedFilePath.fileName)) return null;
    const cachedResponse = readFileSync(cachedFilePath.fileName, 'utf-8');
    return JSON.parse(cachedResponse);
  }

  static getCachedPath(requestedPath) {
    const cachedFetch = path.resolve('./.cached-fetch');
    const requestedResource = requestedPath.replace(/\/|\\|:/g, '_');
    const fileName = `${path.join(cachedFetch, requestedResource)}.json`;
    return {
      fileName,
      folder: path.dirname(fileName),
    };
  }
}
