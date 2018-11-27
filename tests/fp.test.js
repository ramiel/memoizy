const memoizyFP = require('../fp');
const memoizy = require('../index');

jest.mock('../index', () => jest.fn());

describe('FP memoizy', () => {
  beforeEach(() => {
    memoizy.mockClear();
  });

  test('the function is curried', () => {
    const m = memoizyFP({});
    expect(m).toBeInstanceOf(Function);
  });

  test('the memoizer is eventually returned', () => {
    const double = jest.fn(a => a * 2);
    const m = memoizyFP({});
    m(double);
    expect(memoizy).toHaveBeenCalledTimes(1);
  });

  test('all the options are passed', () => {
    const double = jest.fn(a => a * 2);
    const cacheFactory = () => new Map();
    const cacheKeyBuilder = (...args) => JSON.stringify(args);
    const valueAcceptor = () => true;
    const m = memoizyFP({
      maxAge: 2000,
      cache: cacheFactory,
      cacheKey: cacheKeyBuilder,
      valueAccept: valueAcceptor,
    });
    m(double);
    expect(memoizy).toHaveBeenCalledTimes(1);
    expect(memoizy).toHaveBeenCalledWith(
      double,
      {
        maxAge: 2000,
        cache: cacheFactory,
        cacheKey: cacheKeyBuilder,
        valueAccept: valueAcceptor,
      },
    );
  });
});
