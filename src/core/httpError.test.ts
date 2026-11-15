import { describe, expect, it } from 'vitest'
import { HttpError } from './httpError.js'

describe('HttpError', () => {
    it('is both an Error and an HttpError', () => {
        const error = new HttpError(503)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(HttpError)
    })

    it('keeps the response status', () => {
        const error = new HttpError(503)

        expect(error.status).toBe(503)
    })
})
