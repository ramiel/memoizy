const memoizy = require('../fp');

describe('FP memoizy', () => {
  test('the function is curried', () => {
    const m = memoizy({});
    expect(m).toBeInstanceOf(Function);
  });

  test('the memoizer is eventually returned', () => {
    const double = jest.fn(a => a * 2);
    const m = memoizy({});
    const memDouble = m(double);
    memDouble(2);
    memDouble(2);
    expect(double).toHaveBeenCalledTimes(1);
  });
});
