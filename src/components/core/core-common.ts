export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype)
            .filter((name) => ['constructor', 'prototype', '__proto__'].indexOf(name) === -1)
            .forEach((name) => {
                const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            });
        Object.getOwnPropertySymbols(baseCtor.prototype)
            .forEach((name) => {
                const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            });
    });
}
