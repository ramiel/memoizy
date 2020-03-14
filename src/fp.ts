import memoizy, { Options } from ".";

type Fn<TReturn> = (...args: any[]) => TReturn;

const curry = (fn: Fn<any>, ...args: any[]): ((...args: any[]) => any) =>
  args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);

const fpmemoizy = curry((options: Options<any>, fn: Fn<any>) =>
  memoizy(fn, options)
);

export default fpmemoizy;
