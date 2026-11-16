import { afterEach, describe, expect, it, vi } from 'vitest'
import spain from '../fixtures/spain.json' with { type: 'json' }
import { searchCountries } from './searchCountries.js'
import { HttpError } from './httpError.js'

describe('searchCountries', () => {
    afterEach(() => {
        vi.unstubAllGlobals() // вернуть настоящий fetch после каждого теста
    })

    it('returns the countries from a 200 response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve(
                    new Response(JSON.stringify(spain), { status: 200 })
                )
            )
        )

        const result = await searchCountries(
            'spain',
            new AbortController().signal
        )

        expect(result).toEqual(spain)
    })
    it('returns an empty array for a 404 response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() =>
                Promise.resolve(
                    new Response('Country not found', { status: 404 })
                )
            )
        )

        const result = await searchCountries(
            'xyzzy',
            new AbortController().signal
        )

        expect(result).toEqual([])
    })
    it('returns error from a 500 response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(() => Promise.resolve(new Response('spain', { status: 500 })))
        )

        await expect(
            searchCountries('spain', new AbortController().signal)
        ).rejects.toBeInstanceOf(HttpError)
    })
})
