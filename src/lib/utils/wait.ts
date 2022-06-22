/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export function wait(ms: number) {
    return new Promise(r => setTimeout(r,ms));
}