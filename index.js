const isFuture = require('date-fns/is_future');
const addMilliseconds = require('date-fns/add_milliseconds');

const defaultCacheKeyBuilder = (...args) => {
  if (args.length === 0) {
    return '__defaultKey';
  }

  if (args.length === 1) {
    const [firstArgument] = args;
    if (
      firstArgument === null
      || firstArgument === undefined
      || (typeof firstArgument !== 'function' && typeof firstArgument !== 'object')
    ) {
      return firstArgument;
    }
  }

  return JSON.stringify(args);
};

const isExpired = expireDate => isFuture(expireDate);
const getExpireDate = maxAge => addMilliseconds(new Date(), maxAge);

const remember = (fn, {
  cache = new Map(),
  maxAge = Infinity,
  cacheKey = defaultCacheKeyBuilder,
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
    cache.set(key, { value, expireDate: hasExpireDate ? getExpireDate(maxAge) : null });
    return value;
  };

  return memoized;
};

module.exports = remember;
