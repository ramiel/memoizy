# Memoizy

[![CircleCI](https://circleci.com/gh/ramiel/memoizy.svg?style=svg)](https://circleci.com/gh/ramiel/memoizy)

This is a memoization helper that let you memoize and also have the following features

- max age: discard memoized value after a configurable amount of time
- custom cache key: decide how to build your cache key
- clear and delete: delete all the memoized values 
                    or just one for a specific argument set
- conditional memoization: memoize the result only if you like it :)
- fully tested
- small size (~50 LOC)
- small footprint (no dependencies)

## Usage

### Basic

Memoize the return value of a function

```js
const memoize = require('memoizy');

const fact = (n) => {
  if(n === 1) return n;
  return n * fact(n - 1);
}

const memoizedFact = memoize(fact);
memoizedFact(3); // 6
memoizedFact(3); // the return value is always 6 but
                 // the factorial is not computed anymore
```

## API

The memoize function accept the following options

`memoize(fn, options)`

- `maxAge`: Tell how much time the value must be kept in memory, in milliseconds. Default: Infinity
- `cache`: Specify a different cache to be used. It must have the same interface as [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). Default [new Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- `cacheKey`: Function to build the cache key given the arguments.
- `valueAccept`: Function in the form `(err, value) => true/false`. It receive an error (if any) and the memoized value and return true/false. If false is returned, the value is discarded. If the memoized function returns a promise, the resolved value (or the rejection error) is passed to the function. Default null (all values accepted)

## Recipes

### Expire data

```js
const memoize = require('memoizy');

const double = memoize(a => a * 2, {maxAge: 2000});

double(2); // 4
double(2); // returns memoized 4
// wait 2 seconds, memoized value has been discarded
double(2); // Original function is called again and 4 is returned. The value is memoized for other 2 seconds
```

### Discard rejected promises

```js
const memoize = require('memoizy');

const originalFn = async (a) => {
  if(a > 10) return 100;
  throw new Error('Value must be more then 10');
}
const memoized = memoize(originalFn, {valueAccept: (err, value) => !err});

await memoized(1); // throw an error and the value is not memoized
await memoized(15); // returns 100 and the value is memoized
```


### Discard some values

```js
const memoize = require('memoizy');

const originalFn = (a) => {
  if(a > 10) return true;
  return false;
}
// Tell to ignore the false value returned
const memoized = memoize(originalFn, {valueAccept: (err, value) => value === true});

await memoized(1); // discard the result since it's false
await memoized(15); // returns true and it's memoized
```
