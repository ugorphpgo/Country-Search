export type SearchError =
    | { kind: 'aborted' }
    | { kind: 'timeout' }
    | { kind: 'http'; status: number }
    | { kind: 'network' }

export function classifyError(error: unknown): SearchError {
    if (error instanceof Error) {
        return { kind: 'network' }
    }
    return { kind: 'network' }
}
