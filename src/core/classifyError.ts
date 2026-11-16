import { HttpError } from './httpError.js'

export type SearchError =
    | { kind: 'aborted' }
    | { kind: 'timeout' }
    | { kind: 'http'; status: number }
    | { kind: 'network' }

export function classifyError(error: unknown): SearchError {
    if (error instanceof HttpError) {
        return { kind: 'http', status: error.status }
    }

    if (error instanceof DOMException) {
        if (error.name === 'AbortError') {
            return { kind: 'aborted' }
        }
        if (error.name === 'TimeoutError') {
            return { kind: 'timeout' }
        }
    }

    return { kind: 'network' }
}
