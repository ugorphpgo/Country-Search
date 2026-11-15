interface Language {
    name: string
}
interface Currency {
    name: string
}
export interface RawCountry {
    name: string
    area?: number
    flag: string
    borders?: string[]
    capital?: string
    languages: Language[]
    subregion: string
    currencies?: Currency[]
    population: number
    region: string
}

export interface RenderedCountry {
    name: string
    area: number | null
    flag: string
    borders: string[] | null
    capital: string | null
    languages: string[]
    subregion: string
    currencies: string[] | null
    population: number
    region: string
}
