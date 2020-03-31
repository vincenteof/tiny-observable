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
    let values: number[] = []
    const subscription = o.subscribe(value => {
      values.push(value)
    })
    expect(values).toEqual([4, 5])
    expect(someGlobalObj['o']).toEqual('existed')
    subscription.unsubscribe()
    expect(someGlobalObj['o']).toEqual(undefined)
  })
})
