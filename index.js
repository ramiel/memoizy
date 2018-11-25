const defaultCacheKeyBuilder = (...args) => (args.length === 0
  ? '__0aritykey__'
  : JSON.stringify(args));
const isPromise = value => value instanceof Promise;

const remember = (fn, {
  cache = new Map(), maxAge = Infinity, cacheKey = defaultCacheKeyBuilder, valueAccept = null,
} = {
  cache: new Map(), maxAge: Infinity, cacheKey: defaultCacheKeyBuilder, valueAccept: null,
}) => {
  const hasExpireDate = maxAge < Infinity;
  const set = (key, value) => {
    if (hasExpireDate) {
      setTimeout(() => { cache.delete(key); }, maxAge);
    }
    cache.set(
      key, value,
    );
  };

  const memoized = (...args) => {
    const key = cacheKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
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
