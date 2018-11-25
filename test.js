const memoizer = require('./index');

jest.useFakeTimers();

describe('memoizer', () => {
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

    test('a function with a promise arg, 1-arity, is memoized', async () => {
      const fn = jest.fn(async a => `hello ${a}`);
      const mem = memoizer(fn);
      await mem('John');
      await mem('John');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(await mem('Carl')).toBe('hello Carl');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('a function with an undefined arg, 1-arity, is memoized', () => {
      const fn = jest.fn(a => `hello ${a}`);
      const mem = memoizer(fn);
      mem();
      mem();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem('Carl')).toBe('hello Carl');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('a function with an object arg, 1-arity, is memoized', () => {
      const fn = jest.fn(a => JSON.stringify(a));
      const mem = memoizer(fn);
      const res = mem({ name: 'John' });
      mem({ name: 'John' });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mem({ name: 'John' })).toEqual(res);
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

    test('a simple function, n-arity, is memoized', () => {
      const fn = jest.fn((...args) => args.reduce((sum, n) => sum + n, 0));
      const mem = memoizer(fn);
      mem(1, 2, 3, 4);
      mem(1, 2, 3, 4);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('max age', () => {
    beforeEach(() => {
      jest.clearAllTimers();
    });

    test('by default no value is discarded', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn);
      const res = mem();
      jest.advanceTimersByTime(1000 * 1000);
      expect(mem()).toBe(res);
    });

    test('when max-age is set, the value is not discarded before the time', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn, { maxAge: 1000 });
      const res = mem();
      jest.advanceTimersByTime(990);
      expect(mem()).toBe(res);
    });

    test('when max-age is set, the value is NOT discarded before the time (shifted first set)', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn, { maxAge: 1000 });
      jest.advanceTimersByTime(200);
      const res = mem();
      jest.advanceTimersByTime(900);
      expect(mem()).toBe(res);
      jest.advanceTimersByTime(101);
      expect(mem()).not.toBe(res);
    });

    test('when max-age is set, the value is discarded after the time', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn, { maxAge: 1000 });
      const res = mem();
      jest.advanceTimersByTime(1001);
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

  describe('valueAccept function', () => {
    test('skip not accepted value', () => {
      const fn = jest.fn(a => a > 10);
      const mem = memoizer(fn, { valueAccept: (_, v) => v === true });
      mem(5);
      mem(5);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('retain accepted value', () => {
      const fn = jest.fn(a => a > 10);
      const mem = memoizer(fn, { valueAccept: (_, v) => v === true });
      mem(12);
      mem(12);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('can skip a rejected promise', async () => {
      const fn = jest.fn(async () => { throw new Error(); });
      const mem = memoizer(fn, { valueAccept: err => !err });
      await mem().catch(() => {});
      await mem().catch(() => {});
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('can keep a rejected promise', async () => {
      const fn = jest.fn(async () => { throw new Error(); });
      const mem = memoizer(fn, { valueAccept: () => true });
      await mem().catch(() => {});
      await mem().catch(() => {});
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('can retain a fullfilled promise', async () => {
      const fn = jest.fn(async a => a * 2);
      const mem = memoizer(fn, { valueAccept: err => !err });
      await mem(11).catch(() => {});
      await mem(11).catch(() => {});
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('can skip a fullfilled promise', async () => {
      const fn = jest.fn(async a => a * 2);
      const mem = memoizer(fn, { valueAccept: () => false });
      await mem(11).catch(() => {});
      await mem(11).catch(() => {});
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Delete', () => {
    test('can delete a simple function, 0-arity', () => {
      const fn = () => Math.random();
      const mem = memoizer(fn);
      const res = mem();
      mem.delete();
      expect(mem()).not.toBe(res);
    });

    test('can delete a simple function, 1-arity', () => {
      const fn = a => a + Math.random();
      const mem = memoizer(fn);
      const res = mem(2);
      mem.delete(2);
      expect(mem(2)).not.toBe(res);
    });

    test('can delete a simple function, 1-arity, with an object', () => {
      const fn = jest.fn(a => ({ ...a, rand: Math.random() }));
      const mem = memoizer(fn);
      const res = mem({ hello: 'darkness' });
      mem.delete({ hello: 'darkness' });
      expect(mem({ hello: 'darkness' })).not.toEqual(res);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('can delete a simple function, n-arity', () => {
      const fn = jest.fn((...args) => args.reduce((sum, n) => sum + n, 0));
      const mem = memoizer(fn);
      mem(1, 2, 3, 4);
      mem.delete(1, 2, 3, 4);
      mem(1, 2, 3, 4);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Clear', () => {
    test('can clear all the memoized values', () => {
      const fn = jest.fn(a => a + Math.random());
      const mem = memoizer(fn);
      mem(1);
      mem(2);
      mem(1);
      mem(2);
      mem.clear();
      mem(1);
      mem(2);
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });
});
