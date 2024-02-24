const KEY = {
    count: "USE_COUNT"
}


export const addCount = newVal => window.localStorage.setItem(KEY.count, JSON.stringify(newVal))
export const readCount = _=> JSON.parse(window.localStorage.getItem(KEY.count) || '0')