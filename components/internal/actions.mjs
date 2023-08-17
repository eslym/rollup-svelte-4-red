import Text from './Text.svelte';
import SelectionMenu from './SelectionMenu.svelte';
import { writable } from 'svelte/store';

export function tooltip(element, tooltip = '') {
    const popover = RED.popover.tooltip(window.$(element), tooltip);

    return {
        update(tooltip) {
            popover.setContent(tooltip);
        },
        destroy() {
            popover.delete();
        }
    };
}

export function menu(element, options) {
    let opt = {
        ...options,
        options: options.options.map((v) => (typeof v === 'string' ? { label: v, value: v } : v))
    };

    let menu = undefined;

    function openMenu() {
        menu = RED.popover.menu({
            onselect: (selected) => opt.onselect?.(selected.value, element),
            onclose: (value) => {
                menu = undefined;
                opt.onclose?.(value, element);
            },
            width: opt.width,
            maxHeight: opt.maxHeight,
            style: opt.style,
            options: opt.options,
            disposeOnClose: true
        });
        menu.show({
            target: window.$(element),
            align: opt.align,
            offset: opt.offset
        });
    }

    if (options.show) {
        openMenu();
    }

    return {
        update(options) {
            opt = {
                ...options,
                options: options.options.map((v) =>
                    typeof v === 'string'
                        ? { label: v, value: v }
                        : { ...v, onselect: (v) => opt.onselect?.(element) }
                )
            };

            if (menu) {
                if (!opt.show) {
                    menu.hide();
                    menu = undefined;
                    return;
                }
                menu.options(opt.options);
            } else {
                if (!opt.show) return;
                openMenu();
            }
        },
        destroy() {
            menu?.hide();
            menu = undefined;
        }
    };
}

/**
 * @param {HTMLElement} element
 * @param {any} options
 */
export function selection(element, options) {
    const focus = options.focus ?? writable();
    const shown = options.shown ?? writable();
    const menu = new SelectionMenu({
        target: document.body,
        props: {
            shown,
            focus,
            options: options.options,
            onSelect: options.onSelect ? options.onSelect : () => {},
            component: options.component ? options.component : Text,
            minWidth: element.offsetWidth,
            target: element
        }
    });
    const observer = new ResizeObserver(() => {
        menu.$set({ minWidth: element.offsetWidth });
    });
    observer.observe(element);

    const focusOut = () => {
        if (!menu.isFocus()) shown.set(false);
    };

    element.addEventListener('focusout', focusOut);

    return {
        update(options) {
            menu.$set({
                options: options.options,
                onSelect: options.onSelect ? options.onSelect : () => {},
                component: options.component ? options.component : Text
            });
            menu.refreshPosition();
        },
        destroy() {
            element.removeEventListener('focusout', focusOut);
            observer.disconnect();
            menu.$destroy();
        }
    };
}

/**
 * Create a ResizeObserver on an element
 * @param {HTMLElement} element
 * @param {(entry: ResizeObserverEntry)=>void} callback
 */
export function onresize(element, callback) {
    let cb = callback;
    let observer = new ResizeObserver((entries) => {
        entries.forEach((e) => cb(e));
    });
    observer.observe(element);
    return {
        update(callback) {
            cb = callback;
        },
        destroy() {
            observer.disconnect();
        }
    };
}

/**
 *
 * @param {HTMLElement} element
 * @param {(entry: IntersectionObserverEntry)=>void|(IntersectionObserverInit & {callback: (entry: IntersectionObserverEntry)=>void})} options
 * @returns
 */
export function onintersect(element, options) {
    let opts = intersectOptions(options);

    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => opts.callback(e));
        },
        {
            root: opts.root,
            rootMargin: opts.rootMargin,
            threshold: opts.threshold
        }
    );

    observer.observe(element);

    return {
        update(options) {
            const old = opts;
            opts = intersectOptions(options);
            if (
                old.root !== opts.root ||
                old.rootMargin !== opts.rootMargin ||
                old.threshold !== opts.threshold
            ) {
                observer.disconnect();
                observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => opts.callback(e));
                    },
                    {
                        root: opts.root,
                        rootMargin: opts.rootMargin,
                        threshold: opts.threshold
                    }
                );
                observer.observe(element);
            }
        },
        destroy() {
            observer.disconnect();
        }
    };
}

function intersectOptions(options) {
    if (typeof options === 'function') return { callback: options };
    return options;
}
