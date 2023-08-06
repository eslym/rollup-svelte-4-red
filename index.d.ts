declare module '@eslym/rs4r' {
    import type { RollupOptions, InputPluginOption, ExternalOption } from 'rollup';
    import svelte from 'rollup-plugin-svelte';

    export type Options = {
        nodeSrc?: string;
        outDir?: string;
        libDir?: string;
        editorLibDir?: string;
        rollupPlugins?: InputPluginOption[];
        svelteOptions?: Omit<Parameters<typeof svelte>[0], 'compilerOptions'>;
        packageJsonOverride?: Record<string, any>;
        editorExternalDeps?: ExternalOption;
        nodeExternalDeps?: ExternalOption;
        sourceMap?: boolean;
        clean?: boolean;
    };

    export default function makeConfig(options: Options): RollupOptions[];
}
