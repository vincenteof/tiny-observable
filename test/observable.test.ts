import { Observable } from '../src'

describe('Observable', () => {
  it('works with simple observable', () => {
    const simple = new Observable<number>(observer => {
      observer.next(1)
      observer.next(2)
      observer.next(3)
    })
    let arr: number[] = []
    simple.subscribe(value => {
      arr.push(value)
    })
    expect(arr).toEqual([1, 2, 3])
  })
})
