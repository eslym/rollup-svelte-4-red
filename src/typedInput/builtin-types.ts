import type { TypeDefinition } from '..';
import * as evaluators from './evaluators';
import * as setters from './setters';

export type BuiltInTypes = [
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

export const builtinTypes: Record<BuiltInTypes, TypeDefinition> = Object.fromEntries(
    Object.entries(evaluators).map(([key, value]) => [
        key,
        {
            get: value,
            ...(key in setters ? { set: (setters as any)[key] } : {})
        }
    ])
) as any;
