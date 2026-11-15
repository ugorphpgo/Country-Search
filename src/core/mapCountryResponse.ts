import { RawCountry, RenderedCountry } from './types.js'

export function mapCountryResponse(country: RawCountry): RenderedCountry {
    const mockCountry: RenderedCountry = {
        name: 'M',
        capital: 'e',
        region: country.region,
        languages: ['Spanish'],
        borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
        flag: '🇪🇸',
        population: 47351567,
        subregion: 'Southern Europe',
        area: 505992,
        currencies: ['Euro'],
    }
    return mockCountry
}
