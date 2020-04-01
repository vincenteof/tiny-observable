import { Observable } from '../src'

describe('Observable', () => {
  it('works with simple observable', () => {
    const simple = new Observable<number, string>(observer => {
      observer.next(1)
      observer.next(2)
      observer.next(3)
      observer.error('error0')
    })
    const values: number[] = []
    const errors: string[] = []
    simple.subscribe(
      value => {
        values.push(value)
      },
      error => {
        errors.push(error)
      }
    )
    expect(values).toEqual([1, 2, 3])
    expect(errors).toEqual(['error0'])
  })

  it('returns subscription object', () => {
    const someGlobalObj: any = {}
    const o = new Observable<number, string>(observer => {
      someGlobalObj['o'] = 'existed'
      observer.next(4)
      observer.next(5)
      return () => {
        someGlobalObj['o'] = undefined
      }
    })
    const values: number[] = []
    const subscription = o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual([4, 5])
    expect(someGlobalObj['o']).toEqual('existed')
    subscription.unsubscribe()
    expect(someGlobalObj['o']).toEqual(undefined)
  })

  it('creates an observable using `of`', () => {
    const o = Observable.of('i', 'am', 'idiot')
    const values: string[] = []
    o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual(['i', 'am', 'idiot'])
  })

  it('creates an observable from iterable using `from`', () => {
    const o = Observable.from(['i', 'am', 'idiot'])
    const values: string[] = []
    o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual(['i', 'am', 'idiot'])
  })

  it('creates an observable from observable using `from`', () => {
    const o = Observable.from({
      [Symbol.observable]() {
        return new Observable<string>(observer => {
          observer.next('hello')
          observer.next('world')
          observer.complete()
        })
      },
    })
    const values: string[] = []
    o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual(['hello', 'world'])
  })

  it('creates an observable from fake observable using `from`', () => {
    const o = Observable.from({
      [Symbol.observable]() {
        return 'fake'
      },
    })
    const values: string[] = []
    o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual(['fake'])
  })
})
