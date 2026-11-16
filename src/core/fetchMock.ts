import { vi } from 'vitest'
import { Resolve } from './types.js'

export function createFetchMock() {
    const pending: Resolve[] = []

    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
        return new Promise<Response>((resolve: Resolve, reject) => {
            const signal = init?.signal

            if (signal?.aborted) {
                reject(signal.reason as Error)
                return
            }
            if (signal) {
                signal.addEventListener('abort', () => {
                    reject(signal.reason as Error)
                })
            }
            pending.push(resolve)
        })
    })

    return { fetchMock, pending }
}
