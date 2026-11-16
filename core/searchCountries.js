import { HttpError } from './httpError.js';
const BASE_URL = 'https://countries.dev/name/';
const TIMEOUT_MS = 1000;
export async function searchCountries(query, signal) {
    const url = BASE_URL + encodeURIComponent(query);
    const response = await fetch(url, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new HttpError(response.status);
    }
    return (await response.json());
}
