import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import spain from '../fixtures/spain.json' with { type: 'json' }
import { createFetchMock } from './fetchMock.js'
import { createSearchController, SearchState } from './searchController.js'

describe('createSearchController', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    it('shows loading, then results for the typed query', async () => {
        const { fetchMock, pending } = createFetchMock()
        vi.stubGlobal('fetch', fetchMock)
        const states: SearchState[] = []
        const controller = createSearchController((state) => {
            states.push(state)
        }, 300)

        controller.input('spain')
        await vi.advanceTimersByTimeAsync(300)
        expect(states.at(-1)).toEqual({ kind: 'loading', query: 'spain' })

        pending[0](new Response(JSON.stringify(spain)))
        await vi.advanceTimersByTimeAsync(0)
        expect(states.at(-1)).toEqual({
            kind: 'results',
            query: 'spain',
            countries: spain,
        })
    })
    it('shows only the latest query when an older answer arrives later', async () => {
        const { fetchMock, pending } = createFetchMock()
        vi.stubGlobal('fetch', fetchMock)
        const states: SearchState[] = []
        const controller = createSearchController((state) => {
            states.push(state)
        }, 300)
        const old = [{ ...spain[0], name: 'OLD for sp' }]

        controller.input('sp')
        await vi.advanceTimersByTimeAsync(300) // запрос 1
        controller.input('spain')
        await vi.advanceTimersByTimeAsync(300) // запрос 2

        pending[1](new Response(JSON.stringify(spain))) // поздний отвечает первым
        await vi.advanceTimersByTimeAsync(0)
        pending[0](new Response(JSON.stringify(old))) // ранний — последним
        await vi.advanceTimersByTimeAsync(0)

        expect(states.at(-1)).toEqual({
            kind: 'results',
            query: 'spain',
            countries: spain,
        })
        expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true) // запрос 1 отменён
    })

    it('aborts on every input, even while debounce is still waiting', async () => {
        const { fetchMock, pending } = createFetchMock()
        vi.stubGlobal('fetch', fetchMock)
        const states: SearchState[] = []
        const controller = createSearchController((state) => {
            states.push(state)
        }, 300)
        const old = [{ ...spain[0], name: 'OLD for sp' }]

        controller.input('sp')
        await vi.advanceTimersByTimeAsync(300) // запрос 1 летит
        controller.input('spain') // запрос 2 ещё ждёт debounce
        await vi.advanceTimersByTimeAsync(100)

        pending[0](new Response(JSON.stringify(old))) // ответ на 1 пришёл во время ожидания
        await vi.advanceTimersByTimeAsync(0)

        expect(states.some((state) => state.kind === 'results')).toBe(false) // старых стран не показали
        expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true)
    })
})
