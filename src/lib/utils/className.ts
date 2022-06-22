/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export function reAddClassName(element: HTMLElement | null | undefined,name: string) {
    element?.classList.remove(name);
    setTimeout(() => {
        element?.classList.add(name);
    }, 10);
};
