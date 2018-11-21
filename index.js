const isFuture = require('date-fns/is_future');
const addMilliseconds = require('date-fns/add_milliseconds');

const defaultValueAccept = () => true;
const defaultCacheKeyBuilder = (...args) => (args.length === 0
  ? '__defaultKey'
  : JSON.stringify(args));
const isExpired = expireDate => isFuture(expireDate);
const getExpireDate = maxAge => addMilliseconds(new Date(), maxAge);

const remember = (fn, {
  cache = new Map(),
  maxAge = Infinity,
  cacheKey = defaultCacheKeyBuilder,
  valueAccept = defaultValueAccept,
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
    if (valueAccept(value)) {
      cache.set(key, { value, expireDate: hasExpireDate ? getExpireDate(maxAge) : null });
    }
    return value;
  };

  return memoized;
};

module.exports = remember;
