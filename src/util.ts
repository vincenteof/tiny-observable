import { ObservableObject, ObservableLike } from './types'

export const toCleanUp = (cleanup: void | (() => void)) => {
  return typeof cleanup === 'function' ? cleanup : () => {}
}

export function isIterable<V>(obj: ObservableObject<V>): obj is Iterable<V> {
  const asIterable = obj as Iterable<V>
  return typeof asIterable[Symbol.iterator] === 'function'
}

export function isObservableLike<V, E = any>(
  obj: ObservableObject<V>
): obj is ObservableLike<V, E> {
  const observableLike = obj as ObservableLike<V, E>
  return typeof observableLike[Symbol.observable] === 'function'
}
