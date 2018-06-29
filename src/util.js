export default class Util {
  static filteredHash(srcHash, fields) {
    const filteredObject = {};
    fields.forEach((field) => { filteredObject[field] = srcHash[field]; });

    return filteredObject;
  }
}
