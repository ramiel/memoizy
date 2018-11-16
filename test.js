const memoizer = require('./index');

describe('memoizer', () => {
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
});
