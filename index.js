const makeRequest = require('./make-request.js');

const returnStatus = (res) =>
  res.ok ? Promise.resolve(res) : Promise.reject(res.statusText);

const parse = (res) => res.json();

const logAndThrowError = (url) => (err) => {
  console.error(`Unable to complete request to ${url}`);
  throw new Error(err);
};

/**
 * Given an array of urls, will return the results of their requests as an array of results
 *
 * @example
 *  const myURLs = ['http://one.com', 'http://two.com']
 *  requestMultipleURLs(myURLs)
 *    .then(result => doSomethingWith(result)) // [ { urlContent }, { urlContent } ]
 *    .catch(error => handle(error));
 *
 * @param {string[]} urls
 * @returns {Promise} Promise containing concatinated array data on resolve, or error on reject
 *
 */
const requestMultipleURLs = (urls) => {
  if (!Array.isArray(urls))
    return Promise.reject(new Error('Expected an array of urls'));

  if (urls.some((url) => typeof url !== 'string'))
    return Promise.reject(new Error('Expected an array of urls'));

  const distinctURLs = [...new Set(urls)];

  return Promise.all(
    distinctURLs.map((url) =>
      makeRequest(url)
        .then(returnStatus)
        .then(parse)
        .catch(logAndThrowError(url))
    )
  );
};

module.exports = requestMultipleURLs;
