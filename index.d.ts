export interface GenericCache<TKey = void, TValue = void> {
  has: (k: TKey) => boolean;
  get: (k: TKey) => TValue | undefined;
  set: (k: TKey, v: TValue) => void;
  delete: (k: TKey) => boolean;
  clear?: () => void;
}

export interface MemoizyOptions<TResult = any> {
  cache?: () => GenericCache<string, TResult>;
  maxAge?: number;
  cacheKey?: (...args: any[]) => string;
  valueAccept?: null | ((err: Error | null, res?: TResult) => boolean);
}

export interface MemoizedFunction<TResult> {
  (...args: any[]): TResult;
  delete: (...args: any[]) => boolean;
  clear: () => void;
}

export default function memoizy<TResult>(
  fn: (...args: any[]) => TResult,
  options: MemoizyOptions<TResult>,
): MemoizedFunction<TResult>;
