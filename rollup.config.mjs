import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import tinybars from '@eslym/tinybars/rollup';
import { builtinModules } from 'node:module';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const opts = {
    input: {
        index: 'src/index.ts',
        internal: 'src/internal.ts',
        runtime: 'src/runtime.ts',
        tray: 'src/tray.ts'
    },
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
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: 'lib/[name].cjs',
            sourcemap: true
        }
    }
];
