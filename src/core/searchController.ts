import { classifyError, SearchError } from './classifyError.js'
import { debounce } from './debounce.js'
import { searchCountries } from './searchCountries.js'
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
    let controller: AbortController | undefined // текущий запрос: память замыкания
    let lastQuery = '' // для «Повторить»

    async function run(query: string): Promise<void> {
        if (query === '') return // пустое поле — запрос не шлём

        controller = new AbortController()
        onState({ kind: 'loading', query })

        try {
            const countries = await searchCountries(query, controller.signal)
            onState(
                countries.length > 0
                    ? { kind: 'results', query, countries }
                    : { kind: 'empty', query } // 404 → пустой массив
            )
        } catch (e) {
            const error = classifyError(e)
            if (error.kind === 'aborted') return // своя отмена — не показываем
            onState({ kind: 'error', query, error })
        }
    }

    const debouncedRun = debounce((query) => {
        void run(query) // запустить и не ждать
    }, delay)

    return {
        input: (text) => {
            const query = text.trim()
            lastQuery = query
            controller?.abort() // отмена на КАЖДЫЙ ввод
            if (query === '') {
                onState({ kind: 'idle' }) // очистить сразу
            }
            debouncedRun(query) // пустая строка тоже идёт сюда:
            // сбросит отложенный поиск (ловушка 3)
        },
        retry: () => {
            controller?.abort()
            void run(lastQuery) // сразу, без debounce
        },
    }
}
