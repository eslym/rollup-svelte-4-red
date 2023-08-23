declare module '@eslym/rs4r' {
    import type { Node, NodeAPI, NodeMessage } from 'node-red';

    interface AsyncContext {
        get<T = any>(key: string, store?: string): Promise<T>;
        get<T = any>(keys: string[], store?: string): Promise<T[]>;
        set<T = any>(key: string, value: T, store?: string): Promise<void>;
        set<T = any>(keys: string[], values: T[], store?: string): Promise<void>;
        keys(store?: string): Promise<string[]>;
    }

    interface TypedInputValue {
        type: string;
        value: string;
        [key: string]: any;
    }

    export interface RS4RNodeWrapper {
        node: Node;
        RED: NodeAPI;
        global: AsyncContext;
        flow: AsyncContext;
        evaluate<T = any>(
            msg: NodeMessage,
            typedInput: { type: string; value: string },
            types?: EvaluationTypes
        ): Promise<T>;
        set(
            msg: NodeMessage,
            typedInput: { type: string; value: string },
            value: any,
            types?: SetterTypes
        ): Promise<void>;
    }

    export type EvaluationFunction<T extends any | Promise<any> = any> = (
        this: RS4RNodeWrapper,
        msg: NodeMessage,
        value: string,
        typedInput: TypedInputValue
    ) => T;

    export type SetterFunc = (
        this: RS4RNodeWrapper,
        msg: NodeMessage,
        property: string,
        value: any,
        typedInput: TypedInputValue
    ) => Promise<void>;

    export type TypeDefinition<T = any> =
        | {
              get: EvaluationFunction<T>;
              set?: SetterFunc;
          }
        | {
              set: SetterFunc;
          };

    type BuiltInTypes = [
        'str',
        'msg',
        'flow',
        'global',
        'env',
        'num',
        'bool',
        'json',
        're',
        'date',
        'jsonata',
        'bin',
        'node',
        'undefined'
    ][number];

    type EvaluationTypes =
        | Record<string, EvaluationFunction | TypeDefinition | true>
        | BuiltInTypes[];

    type SetterTypes =
        | Record<string, SetterFunc | TypeDefinition | true>
        | ('msg' | 'flow' | 'global')[];

    export function RS4R(node: Node, RED: NodeAPI): RS4RNodeWrapper;
}

declare module '@eslym/rs4r/rollup' {
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
