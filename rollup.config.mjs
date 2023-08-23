import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import tinybars from '@eslym/tinybars/rollup';
import { builtinModules } from 'node:module';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const input = {
    index: 'src/index.ts',
    rollup: 'src/rollup.ts'
};

const opts = {
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        tinybars({
            extensions: ['.tiny.hbs']
        })
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...builtinModules, /^node:/, '$package.json']
};

/** @type {import('rollup').OutputOptions[]} */
export default [
    {
        ...opts,
        input: {
            ...input,
            internal: 'src/internal.ts',
            runtime: 'src/runtime.ts'
        },
        output: {
            dir: 'dist',
            format: 'esm',
            entryFileNames: '[name].mjs',
            chunkFileNames: 'lib/[name].mjs',
            sourcemap: true
        }
    },
    {
        ...opts,
        input,
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: 'lib/[name].cjs',
            sourcemap: true
        }
    }
];
