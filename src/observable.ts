import {
  IObservable,
  IObserver,
  ISubscription,
  SubscriberFunction,
} from './types'
import { toCleanUp } from './util'

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
