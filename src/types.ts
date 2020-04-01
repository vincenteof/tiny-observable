import 'symbol-observable'
export interface IObservable<T, E> {
  // Subscribes to the sequence with an observer
  subscribe(observer: IObserver<T, E>): ISubscription

  // Subscribes to the sequence with callbacks
  subscribe(
    onNext: (value: T) => void,
    onError?: (errorValue: E) => void,
    onComplete?: () => void
  ): ISubscription

  [Symbol.observable](): IObservable<T, E>

  // todo:
  // map<U>(f: (value: T) => U): IObservable<U, E>
  // filter(predicate: (value: T) => boolean): IObservable<T, E>
}

export interface ISubscription {
  // Cancels the subscription
  unsubscribe(): void

  // A boolean value indicating whether the subscription is closed
  closed: boolean
}

export type SubscriberFunction<T, E> = (
  observer: IObserver<T, E>
) => void | (() => void)

export interface IObserver<T, E> {
  // Receives the subscription object when `subscribe` is called
  // start(subscription: ISubscription): void

  // Receives the next value in the sequence
  next(value: T): void

  // Receives the sequence error
  error(errorValue: E): void

  // Receives a completion notification
  complete(): void
}

// export interface ISubscriptionObserver<T, E> {
//   // Sends the next value in the sequence
//   next(value: T): void

//   // Sends the sequence error
//   error(errorValue: E): void

//   // Sends the completion notification
//   complete(): void

//   // A boolean value indicating whether the subscription is closed
//   closed: boolean
// }

export type ObservableLike<T, E> = {
  [Symbol.observable](): T | IObservable<T, E>
}

export type ObservableObject<T, E = any> = Iterable<T> | ObservableLike<T, E>
