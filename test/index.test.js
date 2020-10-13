const test = require('ava');
const td = require('testdouble');

// test data
const testJSON = require('./test-json');

const getTestResponse = (url) => {
  const index = url.substr(url.lastIndexOf('/') + 1);
  return {
    ok: true,
    json: () => testJSON[index],
  };
};

td.replace(
  '../make-request',
  (url) =>
    new Promise((resolve) => {
      if (url.startsWith('https://valid.url.com'))
        resolve(getTestResponse(url));
      else
        resolve({
          ok: false,
          statusText: 'error',
        });
    })
);

const sut = require('../index');

test('Multiple valid URL JSON content is returned in an array', async (t) =>
  sut([
    'https://valid.url.com/0',
    'https://valid.url.com/1',
    'https://valid.url.com/2',
  ]).then((res) => {
    t.deepEqual(res, testJSON);
  }));

test('Single URL JSON content is returned in an array', async (t) =>
  sut(['https://valid.url.com/0']).then((res) => {
    t.deepEqual(res, [testJSON[0]]);
  }));

test('Empty input returns empty result array ', async (t) =>
  sut([]).then((res) => {
    t.deepEqual(res, []);
  }));

test('Invalid input type is rejected and Error thrown', async (t) =>
  t.throwsAsync(() => sut('this isnt an array!?')));

test('Invalid input type in the input array is rejected and Error thrown', async (t) =>
  t.throwsAsync(() =>
    sut([
      'https://valid.url.com/0',
      'https://valid.url.com/1',
      'https://valid.url.com/2',
      123,
    ])
  ));

test('Incorrect url is rejected', async (t) =>
  t.throwsAsync(() => sut(['incorrect-url.com'])));

test('Entire urls request rejected if a single url is invalid', async (t) =>
  t.throwsAsync(() =>
    sut([
      'https://valid.url.com/0',
      'https://valid.url.com/1',
      'https://valid.url.com/2',
      'invalid-url',
    ])
  ));

test('if the same url is passed multuple times, its result is only returned once', async (t) =>
  sut([
    'https://valid.url.com/0',
    'https://valid.url.com/1',
    'https://valid.url.com/2',
    'https://valid.url.com/0',
    'https://valid.url.com/1',
    'https://valid.url.com/2',
  ]).then((res) => {
    t.deepEqual(res, testJSON);
  }));
