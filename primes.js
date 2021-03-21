const _ = require('underscore');
const isPrime = require('prime-number')
let order = 2
const k = 1;
const MAX = k * Math.pow(10, order)
const t1 = new Date().getTime();
let primes = _.range(0, MAX).map(i => (i % 2 == 0) ? false : isPrime(i));
let primes_map = {};
primes.forEach((p, i) => { if (p) { primes_map[i] = true };});
const q = primes.filter(x => x).length;
const t2 = new Date().getTime();
console.log('quantity of primes less than ' + MAX + ' is ' + q);
console.log('in ' + (t2 - t1) + ' ms');