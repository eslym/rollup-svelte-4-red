import RenderOption from './RenderOption.svelte';
import SelectionMenu from './SelectionMenu.svelte';
import { writable } from 'svelte/store';

/**
 * @param {HTMLElement} element
 * @param {any} options
 */
export function selection(element, options) {
    const focus = options.focus ?? writable();
    const shown = options.shown ?? writable();
    const context = new Map(options.context ?? []);
    const menu = new SelectionMenu({
        target: document.body,
        props: {
            shown,
            focus,
            options: options.options,
            onSelect: options.onSelect ? options.onSelect : () => {},
            component: options.component ? options.component : RenderOption,
            minWidth: element.offsetWidth,
            class: options.class,
            target: element
        },
        context
    });
    const observer = new ResizeObserver(() => {
        menu.$set({ minWidth: element.offsetWidth });
        menu.refreshPosition();
    });
    observer.observe(element);

    const focusOut = () => {
        requestAnimationFrame(() => {
            if (!menu.isFocus()) shown.set(false);
        });
    };

    element.addEventListener('focusout', focusOut);

    return {
        update(options) {
            menu.$set({
                onSelect: options.onSelect ? options.onSelect : () => {},
                component: options.component ? options.component : RenderOption,
                class: options.class
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
