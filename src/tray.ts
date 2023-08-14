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

function createEditorTrap(id: string, type: string) {
    const el = document.createElement('input');
    el.id = id;
    el.type = type;
    el.style.position = 'absolute';
    el.style.top = '-2000px';
    el.style.zIndex = '-9999';
    return el;
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
            const form = document.createElement('form');
            form.classList.add('form-horizontal');
            form.autocomplete = 'off';
            form.id = 'dialog-form';
            container.append(form);

            form.append(createEditorTrap('red-ui-trap-password', 'password'));
            form.append(createEditorTrap('red-ui-trap-username', 'text'));
            form.append(createEditorTrap('red-ui-trap-user', 'text'));

            const target = document.createElement('div');
            target.style.height = '100%';
            target.style.width = '100%';
            form.append(target);
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
