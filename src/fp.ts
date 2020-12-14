import { memoizy, MemoizyOptions, MemoizedFunction } from './memoizy';

const curry: any = (fn: Function, ...args: unknown[]) =>
  args.length >= fn.length
    ? fn(...args)
    : curry.bind(null, fn, ...args);

const curried = curry(
  <TResult>(
    options: MemoizyOptions<TResult>,
    fn: (...args: unknown[]) => TResult,
  ) => memoizy(fn, options),
);

export function fp<TResult>(
  options: MemoizyOptions<TResult>,
  fn: (...args: any[]) => TResult,
): MemoizedFunction<TResult>;
export function fp(
  options: MemoizyOptions,
): <TResult>(
  fn: (...args: any[]) => TResult,
) => MemoizedFunction<TResult>;
export function fp(...args: any[]) {
  return curried(...args);
}
