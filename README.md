## request_multiple_urls

Request mutiple URLs in a single function call and recieve the results in a Promise.

## Installation

```
$ npm install request-multiple-urls
```

## Usage

```
const requestURLs = require('request_multiple_urls')

const myURLs = ['http://one.com', 'http://two.com']
requestURLs(myURLs)
    .then(result => doSomethingWith(result)) // [ { urlContent }, { urlContent } ]
    .catch(error => handle(error));

```

## Test

Tests are run with [ava](https://github.com/avajs/ava) by running:

```
$ npm test
```
