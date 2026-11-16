export function debounce(fn, delay) {
    let timer;
    return (query) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(query);
        }, delay);
    };
}
