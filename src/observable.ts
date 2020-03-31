import {
  IObservable,
  IObserver,
  ISubscription,
  SubscriberFunction,
  ObservableObject,
} from './types'
import 'symbol-observable'
import { toCleanUp, isIterable, isObservableLike } from './util'

export class Observable<T, E = any> implements IObservable<T, E> {
  constructor(private func: SubscriberFunction<T, E>) {}

  subscribe(
    observerOrNext: IObserver<T, E> | ((value: T) => void),
    onError?: (errorValue: E) => void,
    onComplete?: () => void
  ): ISubscription {
    if (typeof observerOrNext === 'object') {
      const cleanup = this.func(observerOrNext)
      return new Subscription(toCleanUp(cleanup))
    }
    const error = onError ? onError : () => {}
    const complete = onComplete ? onComplete : () => {}
    const observer: IObserver<T, E> = {
      next: observerOrNext,
      error,
      complete,
    }
    return this.subscribe(observer)
  }

  // `Observable.of` creates an Observable of the values provided as arguments.
  // The values are delivered synchronously when `subscribe` is called.
  static of<V>(...values: V[]) {
    return new Observable<V>(observer => {
      values.forEach(value => {
        observer.next(value)
      })
      observer.complete()
    })
  }

  // `Observable.from` converts its argument to an `Observable`.
  // 1. If the argument has a `Symbol.observable` method, then it returns the result of invoking that method.
  //    If the resulting object is not an instance of Observable, then it is wrapped in an Observable which will delegate subscription.
  // 2. Otherwise, the argument is assumed to be an iterable and the iteration values are delivered synchronously when subscribe is called.
  static from<V>(obj: ObservableObject<V>) {
    if (isIterable<V>(obj)) {
      return new Observable<V>(observer => {
        const iterator = obj[Symbol.iterator]()
        let result = iterator.next()
        while (!result.done) {
          observer.next(result.value)
          result = iterator.next()
        }
        observer.complete()
      })
    }

    if (isObservableLike<V>(obj)) {
      return obj[Symbol.observable]()
    }

    return new Observable<V>(observer => {
      observer.next(obj[Symbol.observable])
    })
  }

  // Returns itself
  [Symbol.observable]() {
    return this
  }
}

export class Subscription implements ISubscription {
  private closedStatus = false
  constructor(private cleanup: () => void) {}

  unsubscribe() {
    this.cleanup()
    this.closedStatus = true
  }

  // todo: how to remove duplicated `closedStatus`
  get closed() {
    return this.closedStatus
  }
}
