import { RawCountry, RenderedCountry } from './types.js'

export function mapCountryResponse(country: RawCountry): RenderedCountry {
    return {
        name: country.name,
        flag: country.flag,
        population: country.population,
        subregion: country.subregion,
        area: country.area ?? null,
        region: country.region,
        borders: country.borders ?? null,
        capital: country.capital ?? null,
        languages: country.languages.map((language) => language.name),
        currencies:
            country.currencies?.map((currency) => currency.name) ?? null,
    }
}
