const { advanceBy, advanceTo, clear } = require('jest-date-mock');
const memoizer = require('./index');

jest.useFakeTimers();

describe('memoizer', () => {
  afterAll(() => {
    clear();
  });

  describe('basic', () => {
    test('a simple function, 0-arity, is memoized', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn);
      const res = mem();
      expect(mem()).toBe(res);
    });

    test('a simple function, 1-arity, is memoized', () => {
      const fn = jest.fn(a => a + 1);
      const mem = memoizer(fn);
      mem(2);
      mem(2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem(3)).toBe(4);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('a function with a string arg, 1-arity, is memoized', () => {
      const fn = jest.fn(a => `hello ${a}`);
      const mem = memoizer(fn);
      mem('John');
      mem('John');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem('Carl')).toBe('hello Carl');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('a function with an object arg, 1-arity, is memoized', () => {
      const fn = jest.fn(a => JSON.stringify(a));
      const mem = memoizer(fn);
      mem({ name: 'John' });
      mem({ name: 'John' });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem({ name: 'Ludwig' })).toBe(JSON.stringify({ name: 'Ludwig' }));
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('a simple function, 2-arity, is memoized', () => {
      const fn = jest.fn((a, b) => a + b);
      const mem = memoizer(fn);
      mem(2, 3);
      mem(2, 3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem(3, 4)).toBe(7);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('max age', () => {
    beforeEach(() => {
      advanceTo(Date.current());
    });

    test('by default no value is discarded', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn);
      const res = mem();
      advanceBy(1000 * 1000);
      expect(mem()).toBe(res);
    });

    test('when max-age is set, the value is not discarded before the time', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn, { maxAge: 1000 });
      const res = mem();
      advanceBy(990);
      expect(mem()).toBe(res);
    });

    test('when max-age is set, the value is discarded after the time', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn, { maxAge: 1000 });
      const res = mem();
      advanceBy(1001);
      expect(mem()).not.toBe(res);
    });
  });

  describe('cacheKey custom function', () => {
    test('same memoization for odd values', () => {
      const fn = jest.fn(a => `hello ${a}`);
      const mem = memoizer(fn, {
        cacheKey: (a) => {
          if (a % 2 !== 0) {
            return 'odd';
          }
          return a;
        },
      });
      mem(3);
      mem(5);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem(5)).toBe('hello 3');
      expect(mem(4)).toBe('hello 4');
      expect(mem(6)).toBe('hello 6');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
  describe('acceptValue function', () => {});
});
