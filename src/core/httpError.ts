export class HttpError extends Error {
    readonly status: number
    constructor(status: number) {
        super(`HTTP ${status}`)
        this.status = status
        this.name = 'HttpError'
    }
}
