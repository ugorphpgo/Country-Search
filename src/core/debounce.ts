import { SearchFn } from './types.js'
export function debounce(fn: SearchFn, delay: number): SearchFn {
    let timer: number | undefined
    return (query: string) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(query)
        }, delay)
    }
}
