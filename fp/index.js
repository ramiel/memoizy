const memoizy = require('../index');

const curry = (fn, ...args) => (
  args.length >= fn.length
    ? fn(...args)
    : curry.bind(null, fn, ...args)
);

module.exports = curry((options, fn) => memoizy(fn, options));
