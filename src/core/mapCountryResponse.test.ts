import { describe, expect, it } from 'vitest'
import { RawCountry, RenderedCountry } from './types.js'
import spain from '../fixtures/spain.json' with { type: 'json' }
import antarctica from '../fixtures/antarctica.json' with { type: 'json' }
import japan from '../fixtures/japan.json' with { type: 'json' }
import { mapCountryResponse } from './mapCountryResponse.js'

describe('mapCountryResponse', () => {
    const copyCountry: RawCountry = structuredClone(spain[0])
    const expected: RenderedCountry = {
        name: 'Spain',
        capital: 'Madrid',
        region: 'Europe',
        languages: ['Spanish'],
        borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
        flag: '🇪🇸',
        population: 47351567,
        subregion: 'Southern Europe',
        area: 505992,
        currencies: ['Euro'],
    }
    it('maps all fields of Spain', () => {
        const responseCountry = mapCountryResponse(spain[0])
        expect(responseCountry).toEqual(expected)
    })
    it('returns null for capital of Antarctica', () => {
        const responseCountry = mapCountryResponse(antarctica[0])
        expect(responseCountry.capital).toBe(null)
    })
    it('returns null for currencies of Antarctica', () => {
        const responseCountry = mapCountryResponse(antarctica[0])
        expect(responseCountry.currencies).toBeNull()
    })
    it('returns null for borders of Japan', () => {
        const responseCountry = mapCountryResponse(japan[0])
        expect(responseCountry.borders).toBeNull()
    })
    it('does not mutate the input', () => {
        expect(spain[0]).toEqual(copyCountry)
    })
})
