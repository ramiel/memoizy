const isFuture = require('date-fns/is_past');
const addMilliseconds = require('date-fns/add_milliseconds');

const defaultCacheKeyBuilder = (...args) => (args.length === 0
  ? '__defaultKey'
  : JSON.stringify(args));
const isExpired = expireDate => isFuture(expireDate);
const getExpireDate = maxAge => addMilliseconds(new Date(), maxAge);

const remember = (fn, {
  cache = new Map(),
  maxAge = Infinity,
  cacheKey = defaultCacheKeyBuilder,
  valueAccept = null,
} = { cache: new Map(), maxAge: Infinity, cacheKey: defaultCacheKeyBuilder }) => {
  const hasExpireDate = maxAge < Infinity;

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
    if (!valueAccept || valueAccept(value)) {
      cache.set(key, { value, expireDate: hasExpireDate ? getExpireDate(maxAge) : null });
    }
    return value;
  };

  memoized.delete = (...args) => {
    const key = cacheKey(...args);
    return cache.delete(key);
  };

  memoized.clear = cache.clear.bind(cache);

  return memoized;
};

module.exports = remember;
