# M

[![CircleCI](https://circleci.com/gh/ramiel/M.svg?style=svg)](https://circleci.com/gh/ramiel/M)

Memoization helper

This is a memoization helper that let you memoize and also have the following feature

- max age: forbid memoized value after an amount of time
- custom cache key: decide how to build your cache key
- clear and delete: delete all the memoized values 
                    or just ones for a specific argument set
- conditional memoization: memoize the result only if you like it :)
- fully tested
- small size
- small footprint

## Usage

### Basic

Memoize the return value of a function

```js
const memoize = require('M');

const fact = (n) => {
  if(n === 1) return n;
  return n * fact(n - 1);
}

const memoizedFact = memoize(fact);
memoizedFact(3); // 6
memoizedFact(3); // the return value is always 6 but
                 // the factorial is not computed anymore
```


