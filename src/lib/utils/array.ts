/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export function pushWithLimit<T>(array: T[],item: T,limit: number) {
    array.push(item);
    while(array.length > limit) array.shift();
    return array;
}

export const distinctArrayFilter = <T>(v: T, i: number, a: T[]) => a.indexOf(v) === i;