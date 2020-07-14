import memoizy, { MemoizyOptions, MemoizedFunction } from ".";

const curry: any = (fn: Function, ...args: unknown[]) =>
  args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);

const curried = curry(
  <TResult>(
    options: MemoizyOptions<TResult>,
    fn: (...args: unknown[]) => TResult
  ) => memoizy(fn, options)
);

function fpmemoizy<TResult>(
  options: MemoizyOptions<TResult>,
  fn: (...args: unknown[]) => TResult
): MemoizedFunction<TResult>;
function fpmemoizy(
  options: MemoizyOptions
): <TResult>(fn: (...args: unknown[]) => TResult) => MemoizedFunction<TResult>;
function fpmemoizy(...args: unknown[]) {
  return curried(...args);
}

export default fpmemoizy;
