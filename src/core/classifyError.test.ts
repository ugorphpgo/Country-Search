import { afterEach, describe, expect, it, vi } from 'vitest'
import { classifyError } from './classifyError.js'
import { createFetchMock } from './fetchMock.js'
import { HttpError } from './httpError.js'
import { searchCountries } from './searchCountries.js'

describe('classifyError', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })
    it('AbortError from own cancel is "aborted"', async () => {
        const { fetchMock } = createFetchMock()
        vi.stubGlobal('fetch', fetchMock)
        const controller = new AbortController()

        const promise = searchCountries('spain', controller.signal)
        controller.abort()
        const error = await promise.catch((e: unknown) => e)

        expect(classifyError(error)).toEqual({ kind: 'aborted' })
    })

    it('HttpError keeps its status', () => {
        expect(classifyError(new HttpError(500))).toEqual({
            kind: 'http',
            status: 500,
        })
    })

    it('TypeError from fetch is "network"', () => {
        expect(classifyError(new TypeError('Failed to fetch'))).toEqual({
            kind: 'network',
        })
    })

    it('404 is not an error: search resolves with an empty array', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve(
                    new Response('Country not found', { status: 404 })
                )
            )
        )
        await expect(
            searchCountries('iakcuf', new AbortController().signal)
        ).resolves.toEqual([])
    })
    it('TimeoutError is "timeout"', async () => {
        const { fetchMock } = createFetchMock()
        vi.stubGlobal('fetch', fetchMock)
        const timer = new AbortController()
        vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timer.signal)

        const promise = searchCountries('spain', new AbortController().signal)
        timer.abort(new DOMException('timed out', 'TimeoutError'))
        const error = await promise.catch((e: unknown) => e)

        expect(classifyError(error)).toEqual({ kind: 'timeout' })
    })
})
