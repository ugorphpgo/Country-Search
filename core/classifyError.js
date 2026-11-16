import { HttpError } from './httpError.js';
export function classifyError(error) {
    if (error instanceof HttpError) {
        return { kind: 'http', status: error.status };
    }
    if (error instanceof DOMException) {
        if (error.name === 'AbortError') {
            return { kind: 'aborted' };
        }
        if (error.name === 'TimeoutError') {
            return { kind: 'timeout' };
        }
    }
    return { kind: 'network' };
}
