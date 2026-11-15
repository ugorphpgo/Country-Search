import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce.js'

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('does not call fn before delay and calls it after', () => {
        const fn = vi.fn()

        const search = debounce(fn, 300)

        search('sp')

        vi.advanceTimersByTime(299)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)
    })
    it('resets the timer on each call and uses the last argument', () => {
        const fn = vi.fn()

        const search = debounce(fn, 300)

        search('sp')

        vi.advanceTimersByTime(299)
        expect(fn).not.toHaveBeenCalled()

        search('spa')
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(0)

        vi.advanceTimersByTime(299)
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenLastCalledWith('spa')
    })
    it('two debounced functions do not share a timer', () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()
        const search1 = debounce(fn1, 300)
        const search2 = debounce(fn2, 300)

        search1('a')
        vi.advanceTimersByTime(200)
        search2('b')
        vi.advanceTimersByTime(100)

        expect(fn1).toHaveBeenCalledTimes(1)
        expect(fn2).not.toHaveBeenCalled()
    })
})
