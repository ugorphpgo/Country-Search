import { SearchFn } from './types.js'
export function debounce(fn: SearchFn, delay: number): SearchFn {
    return (query: string) => {
        if (delay >= 0) {
            fn(query)
        }
    }
}
