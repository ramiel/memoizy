const defaultCacheKeyBuilder = (...args) => (args.length === 0
  ? '__0aritykey__'
  : JSON.stringify(args));
const isPromise = value => value instanceof Promise;
const defaultOptions = {
  cache: () => new Map(), maxAge: Infinity, cacheKey: defaultCacheKeyBuilder, valueAccept: null,
};

const memoizy = (fn, {
  cache: cacheFactory = () => new Map(),
  maxAge = Infinity,
  cacheKey = defaultCacheKeyBuilder,
  valueAccept = null,
} = defaultOptions) => {
  const hasExpireDate = maxAge < Infinity;
  const cache = cacheFactory();

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
  memoized.clear = () => {
    if (cache.clear instanceof Function) {
      cache.clear();
    } else {
      throw new Error('This cache doesn\'t support clear');
    }
  };

  return memoized;
};

module.exports = memoizy;
