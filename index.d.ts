declare module '@eslym/rs4r' {
    import type { RollupOptions, InputPluginOption, ExternalOption } from 'rollup';
    import svelte from 'rollup-plugin-svelte';

    export type Options = {
        nodeSrc?: string;
        outDir?: string;
        libDir?: string;
        editorLibDir?: string;
        examplesDir?: string | false;
        rollupPlugins?: InputPluginOption[];
        svelteOptions?: Omit<Parameters<typeof svelte>[0], 'compilerOptions'>;
        packageJsonOverride?: Record<string, any>;
        editorExternalDeps?: ExternalOption;
        nodeExternalDeps?: ExternalOption;
        readme?: string | false;
        sourceMap?: boolean | 'inline' | 'hidden';
        clean?: boolean;
    };

    export default function makeConfig(options: Options): RollupOptions[];
}

declare module '@eslym/rs4r/runtime' {
    export const editingNodeContextKey: Symbol;
}

declare module '@eslym/rs4r/tray' {
    import { ComponentType } from 'svelte';

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
    }

    export function openTray<T extends Record<string, any>>(
        component: ComponentType,
        options: OpenTrayOptions<T>
    ): void;

    export function openTypeEditor<T extends Record<string, any>>(
        component: ComponentType,
        options: OpenTrayOptions<T>
    ): void;
}
