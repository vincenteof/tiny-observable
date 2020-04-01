import { ObservableObject, IObservable } from './types'

export const toCleanUp = (cleanup: void | (() => void)) => {
  return typeof cleanup === 'function' ? cleanup : () => {}
}

export function isIterable<V>(obj: ObservableObject<V>): obj is Iterable<V> {
  const asIterable = obj as Iterable<V>
  return typeof asIterable[Symbol.iterator] === 'function'
}

export function isIObservable<T>(obj: any): obj is IObservable<T, any> {
  return typeof (obj as any)[Symbol.observable] === 'function'
}
