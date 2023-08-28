import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { derived, get } from 'svelte/store';

function _class(list, cl) {
    if (cl) list.add(cl);
}

export function mergeClass(...args) {
    const list = new Set();
    for (const arg of args) {
        if (typeof arg === 'string') {
            for (const cl of arg.split(' ')) _class(list, cl);
        } else if (Array.isArray(arg)) {
            for (const cl of arg) _class(list, cl);
        } else if (typeof arg === 'object') {
            for (const key in arg) {
                if (arg[key]) _class(list, key);
            }
        }
    }
    return [...list].sort().join(' ');
}

/**
 * @param {import('svelte/store').Writable} store
 * @param {string[]} prop
 * @returns {import('svelte/store').Writable}
 */
export function propWritable(store, prop) {
    let _prev = cloneDeep(getProp(get(store), prop));
    const reader = derived(store, ($val) => getProp($val, prop));
    const set = (val) => {
        if (isEqual(val, _prev)) return;
        _prev = cloneDeep(val);
        store.update(($val) => {
            setProp($val, prop, val);
            return $val;
        });
    };
    return {
        subscribe: (run, invalidate) => {
            let notified = undefined;
            let first = true;
            return reader.subscribe((val) => {
                if (!first && isEqual(val, notified)) return;
                first = true;
                if (invalidate) invalidate();
                notified = cloneDeep(val);
                run(val);
            });
        },
        set,
        update: (fn) => set(fn(_prev))
    };
}

export function getProp(val, prop) {
    let current = val;
    for (const key of prop) {
        if (!(key in current)) return undefined;
        current = current[key];
    }
    return current;
}

export function setProp(val, prop, value) {
    let current = val;
    while (prop.length > 1) {
        const key = prop.shift();
        if (!(key in current)) current[key] = {};
        current = current[key];
    }
    current[prop[0]] = value;
}
