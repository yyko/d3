const express = require('express');
const _ = require('underscore');
const path = require('path');
const app = express();
const port = 3000;

function html_resp() {
    return "<h1>Hello!</h1>";
}

app.get('/', (request, response) => {
  let url;
  const q = request.query;
  if (typeof q.url !== 'undefined') {
  } else {
    response.send(html_resp());
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});

const isPrime = require('prime-number')
console.log(isPrime(7))
const q_100000 = (_.range(0, 100000).map(i=>isPrime(i))).filter(x=>x).length;
console.log(q_100000)