import type { ComponentType, SvelteComponent } from 'svelte';
import { name } from '$package.json';

export interface OpenTrayOptions<T extends Record<string, any>> {
    props?: T;
    binding?: {
        [K in keyof T]: (value: T[K]) => void;
    };
    context?: Map<any, any>;
    on?: Record<string, (event: CustomEvent) => void>;
    title?: string;
    width?: string | number;
    maximized?: boolean;
    buttons?: {
        text: string;
        class?: string;
        click?: () => void;
    }[];
    show?: () => void;
    close?: () => void;
}

export function openTray<T extends Record<string, any>>(
    component: ComponentType,
    options: OpenTrayOptions<T>
): void {
    const ctx = new Map(options.context ?? []);

    let instance: SvelteComponent;

    RED.tray.show({
        title: options.title,
        width: options.width as any, // out-dated node-red typing
        maximized: options.maximized ?? false,
        buttons: options.buttons ?? [],
        open(tray: JQuery) {
            const container = tray.find('.red-ui-tray-body');
            const target = document.createElement('div');
            target.style.width = '100%';
            target.style.height = '100%';
            target.style.padding = '1em';
            target.style.boxSizing = 'border-box';
            container.append(target);
            instance = new component({
                target,
                props: options.props,
                context: ctx
            });

            if (options.binding) {
                for (const [key, listener] of Object.entries(options.binding)) {
                    const index = instance.$$?.props?.[key];
                    if (index === undefined) continue;
                    instance.$$.bound[index] = listener;
                }
            }

            if (options.on) {
                for (const [key, listener] of Object.entries(options.on)) {
                    instance.$on(key, listener);
                }
            }
        },
        show: options.show,
        close: () => {
            instance.$destroy();
            options.close?.();
        }
    });
}

export function openTypeEditor<T extends Record<string, any>>(
    component: ComponentType,
    options: OpenTrayOptions<T>
): void {
    RED.editor.showTypeEditor(name, {
        ...options,
        component
    } as any);
}

RED.editor.registerTypeEditor(name, {
    show(options) {
        RED.view.state(RED.state.EDITING);
        openTray(options.component, options);
    }
});
