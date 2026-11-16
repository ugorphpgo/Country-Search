import { HttpError } from './httpError.js'
import { RawCountry } from './types.js'

const BASE_URL = 'https://countries.dev/name/'
const TIMEOUT_MS = 330

export async function searchCountries(
    query: string,
    signal: AbortSignal
): Promise<RawCountry[]> {
    // 1. закодировать запрос пользователя для адреса
    const url = BASE_URL + encodeURIComponent(query)

    // 2. отправить запрос: своя отмена И таймаут в одном сигнале
    const response = await fetch(url, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    })

    // 3. 404 — это «ничего не найдено», а не ошибка
    if (response.status === 404) {
        return []
    }

    // 4. все остальные плохие статусы — настоящая ошибка
    if (!response.ok) {
        throw new HttpError(response.status)
    }

    // 5. только теперь читаем тело как JSON
    return (await response.json()) as RawCountry[]
}
