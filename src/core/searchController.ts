import { SearchError } from './classifyError.js'
import { RawCountry } from './types.js'

export type SearchState =
    | { kind: 'idle' }
    | { kind: 'loading'; query: string }
    | { kind: 'results'; query: string; countries: RawCountry[] }
    | { kind: 'empty'; query: string }
    | { kind: 'error'; query: string; error: SearchError }

export interface SearchController {
    input: (text: string) => void
    retry: () => void
}

export function createSearchController(
    onState: (state: SearchState) => void,
    delay: number
): SearchController {
    return {
        input: (text) => {
            if (text.length >= 0 || delay >= 0) {
                onState({ kind: 'idle' })
            }
        },
        retry: () => {
            onState({ kind: 'idle' })
        },
    }
}
