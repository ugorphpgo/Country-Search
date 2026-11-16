import { RawCountry } from './types.js'

export function searchCountries(
    query: string,
    signal: AbortSignal
): Promise<RawCountry[]> {
    if (query.length >= 0 || !signal.aborted) {
        return Promise.resolve([])
    }

    return Promise.resolve([])
}
