import { mapCountryResponse } from '../core/mapCountryResponse.js'
import {
    createSearchController,
    SearchState,
} from '../core/searchController.js'
import { RenderedCountry } from '../core/types.js'

const DELAY_MS = 600

function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className: string,
    text = ''
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag)
    node.className = className
    node.textContent = text
    return node
}

const input = el('input', 'search__input')
input.type = 'search'
input.placeholder = 'Название страны'
const status = el('p', 'search__status')
const list = el('ul', 'search__list')
const details = el('section', 'search__details')
document.body.append(input, status, list, details)

function renderDetails(country: RenderedCountry): void {
    details.replaceChildren(
        el('h2', 'details__title', `${country.flag} ${country.name}`),
        el('p', 'details__row', `Описание: ${country.subregion}`),
        el(
            'p',
            'details__row',
            `Площадь: ${country.area === null ? '—' : country.area.toLocaleString('ru-RU')} км²`
        ),
        el(
            'p',
            'details__row',
            `Границы: ${country.borders?.join(', ') ?? 'нет'}`
        ),
        el('p', 'details__row', `Языки: ${country.languages.join(', ')}`),
        el(
            'p',
            'details__row',
            `Валюта: ${country.currencies?.join(', ') ?? 'нет'}`
        )
    )
}

function renderCard(country: RenderedCountry): HTMLLIElement {
    const card = el('li', 'card')
    card.append(
        el('span', 'card__flag', country.flag),
        el('h3', 'card__name', country.name),
        el('p', 'card__row', `Столица: ${country.capital ?? '—'}`),
        el('p', 'card__row', `Регион: ${country.region}`),
        el(
            'p',
            'card__row',
            `Население: ${country.population.toLocaleString('ru-RU')}`
        )
    )
    card.addEventListener('click', () => {
        renderDetails(country)
    })
    return card
}

function render(state: SearchState): void {
    details.replaceChildren()
    switch (state.kind) {
        case 'idle':
            status.textContent = ''
            list.replaceChildren()
            break
        case 'loading':
            status.textContent = 'Загрузка'
            break
        case 'results':
            status.textContent = ''
            list.replaceChildren(
                ...state.countries.map((raw) =>
                    renderCard(mapCountryResponse(raw))
                )
            )
            break
        case 'empty':
            status.textContent = 'Мы ничего не нашли'
            list.replaceChildren()
            break
        case 'error': {
            const retry = el('button', 'search__retry', 'Повторить')
            retry.type = 'button'
            retry.addEventListener('click', () => {
                controller.retry()
            })
            status.textContent =
                state.error.kind === 'timeout'
                    ? 'Время ожидания ответа вышло'
                    : 'Возникла ошибка, попробуйте ещё раз'
            status.append(retry)
            list.replaceChildren()
            break
        }
    }
}

const controller = createSearchController(render, DELAY_MS)
input.addEventListener('input', () => {
    controller.input(input.value)
})
