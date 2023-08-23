import type { Node, NodeAPI, NodeContextData, NodeMessage } from 'node-red';
import { type BuiltInTypes, builtinTypes } from './typedInput/builtin-types';
import { error } from './error';

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
        typedInput: TypedInputValue,
        types?: EvaluationTypes
    ): Promise<T>;
    set(
        msg: NodeMessage,
        typedInput: TypedInputValue,
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

type EvaluationTypes = Record<string, EvaluationFunction | TypeDefinition | true> | BuiltInTypes[];

type SetterTypes =
    | Record<string, SetterFunc | TypeDefinition | true>
    | ('msg' | 'flow' | 'global')[];

function wrapContextCall(ctx: NodeContextData, func: Function, ...args: any[]) {
    return new Promise((resolve, reject) => {
        func.call(ctx, ...args, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function wrapContext(ctx: NodeContextData): AsyncContext {
    return {
        get(key: string | string[], store?: string) {
            return wrapContextCall(ctx, ctx.get, key, store) as any;
        },
        set(key: string | string[], value: any, store?: string) {
            return wrapContextCall(ctx, ctx.set, key, value, store) as any;
        },
        keys(store?: string) {
            return wrapContextCall(ctx, ctx.keys, store) as any;
        }
    };
}

async function evaluateTypedInput(
    this: RS4RNodeWrapper,
    msg: NodeMessage,
    typedInput: TypedInputValue,
    types: EvaluationTypes = builtinTypes
): Promise<any> {
    if (Array.isArray(types)) {
        types = Object.fromEntries(types.map((type) => [type, builtinTypes[type]]));
    }
    if (!(typedInput.type in types)) {
        throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
    }
    let type = types[typedInput.type];
    if (typeof type === 'function') {
        return type.call(this, msg, typedInput.value, typedInput);
    }
    if (type === true) {
        if (!(typedInput.type in builtinTypes))
            throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
        type = builtinTypes[typedInput.type as BuiltInTypes];
    }
    if (!('get' in type)) throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
    return type.get.call(this, msg, typedInput.value, typedInput);
}

async function setByTypedInput(
    this: RS4RNodeWrapper,
    msg: NodeMessage,
    typedInput: TypedInputValue,
    value: any,
    types: SetterTypes = builtinTypes
) {
    if (Array.isArray(types)) {
        types = Object.fromEntries(types.map((type) => [type, builtinTypes[type]]));
    }
    if (!(typedInput.type in types)) {
        throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
    }
    let type = types[typedInput.type];
    if (typeof type === 'function') {
        return type.call(this, msg, typedInput.value, value, typedInput);
    }
    if (type === true) {
        if (!(typedInput.type in builtinTypes))
            throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
        type = builtinTypes[typedInput.type as BuiltInTypes];
    }
    if (!('set' in type)) throw error('INVALID_TYPE', `Invalid type: ${typedInput.type}`);
    return type.set!.call(this, msg, typedInput.value, value, typedInput);
}

const nodeVars = new WeakMap<Node, RS4RNodeWrapper>();

export function RS4R(node: Node, RED: NodeAPI) {
    if (!nodeVars.has(node)) {
        nodeVars.set(node, {
            node,
            RED,
            global: wrapContext(node.context().global),
            flow: wrapContext(node.context().flow),
            evaluate(
                msg: NodeMessage,
                typedInput: TypedInputValue,
                types: EvaluationTypes = builtinTypes
            ) {
                return evaluateTypedInput.call(nodeVars.get(node)!, msg, typedInput, types);
            },
            set(
                msg: NodeMessage,
                typedInput: TypedInputValue,
                value: any,
                types: SetterTypes = builtinTypes
            ) {
                return setByTypedInput.call(nodeVars.get(node)!, msg, typedInput, value, types);
            }
        });
    }
    return nodeVars.get(node)!;
}
