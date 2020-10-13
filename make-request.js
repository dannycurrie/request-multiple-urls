const fetch = require('node-fetch');

/**
 * Makes a request to the given URL and returns the response in a Promise
 *
 * @param {string} url
 * @returns {Promise<Reponse>}
 */
async function makeRequest(url) {
  // just a wrapper to isolate our chosen request dependency
  return fetch(url);
}

module.exports = makeRequest;
