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
})
