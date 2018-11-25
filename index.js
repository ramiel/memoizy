const isPast = require('date-fns/is_past');
const addMilliseconds = require('date-fns/add_milliseconds');

const defaultCacheKeyBuilder = (...args) => (args.length === 0
  ? '__0aritykey__'
  : JSON.stringify(args));
const isExpired = expireDate => isPast(expireDate);
const getExpireDate = maxAge => addMilliseconds(new Date(), maxAge);
const isPromise = value => value instanceof Promise;

const remember = (fn, {
  cache = new Map(), maxAge = Infinity, cacheKey = defaultCacheKeyBuilder, valueAccept = null,
} = {
  cache: new Map(), maxAge: Infinity, cacheKey: defaultCacheKeyBuilder, valueAccept: null,
}) => {
  const hasExpireDate = maxAge < Infinity;
  const set = (key, value) => cache.set(
    key, { value, expireDate: hasExpireDate && getExpireDate(maxAge) },
  );

  const memoized = (...args) => {
    const key = cacheKey(...args);
    if (cache.has(key)) {
      const { value, expireDate } = cache.get(key);
      if (!hasExpireDate || !isExpired(expireDate)) {
        return value;
      }
      cache.delete(key);
    }
    const value = fn(...args);

    if (!valueAccept) {
      set(key, value);
    } else if (isPromise(value)) {
      value
        .then(res => [null, res])
        .catch(err => [err])
        .then(([err, res]) => {
          if (valueAccept(err, res)) {
            set(key, value);
          }
        });
    } else if (valueAccept(null, value)) {
      set(key, value);
    }

    return value;
  };

  memoized.delete = (...args) => cache.delete(cacheKey(...args));
  memoized.clear = cache.clear.bind(cache);

  return memoized;
};

module.exports = remember;
