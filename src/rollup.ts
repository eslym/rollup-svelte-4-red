import type { RollupOptions, InputPluginOption, Plugin, ExternalOption } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import virtual from '@rollup/plugin-virtual';
import css from 'rollup-plugin-import-css';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import entryTemplate from './entry.tiny.hbs';
import htmlTemplate from './html.tiny.hbs';
import packageTemplate from './package.tiny.hbs';
import injectCss from './css.tiny.hbs';
import { globSync as glob } from 'glob';
import { normalizePath } from '@rollup/pluginutils';

export type Options = {
    nodeSrc?: string;
    outDir?: string;
    libDir?: string;
    sharedLibDir?: string;
    examplesDir?: string | false;
    editorLibDir?: string;
    rollupPlugins?: InputPluginOption[];
    svelteOptions?: Omit<Parameters<typeof svelte>[0], 'compilerOptions'>;
    packageJsonOverride?: Record<string, any>;
    editorExternalDeps?: ExternalOption;
    nodeExternalDeps?: ExternalOption;
    readme?: string | false;
    sourceMap?: boolean | 'inline' | 'hidden';
    clean?: boolean;
};

function extractNodeName(file: string, src: string) {
    const node = path.dirname(path.relative(src, file));
    return normalizePath(node).replace(/\//g, '.');
}

function stripExt(file: string) {
    return file.slice(0, file.lastIndexOf('.'));
}

export default function makeConfig(options: Options): RollupOptions[] {
    const opts: Required<
        Omit<Options, 'packageJsonOverride' | 'libDir' | 'editorLibDir' | 'sharedLibDir'>
    > = {
        nodeSrc: './src/nodes',
        outDir: './dist',
        examplesDir: './examples',
        rollupPlugins: [],
        svelteOptions: {},
        editorExternalDeps: [],
        nodeExternalDeps: [],
        sourceMap: false,
        readme: 'README.md',
        clean: true,
        ...options
    };
    const libDir = options.libDir ?? './src/lib';
    const editorLibDir = options.editorLibDir ?? './src/editor';
    const sharedLibDir = options.sharedLibDir ?? './src/shared';
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    for (const [key, value] of Object.entries(options.packageJsonOverride ?? {})) {
        pkg[key] = value;
    }

    const search = path.join(opts.nodeSrc, '*/**/index.{js,ts}');
    const nodeSource = glob(normalizePath(search));

    const nodeMap: {
        [name: string]: {
            name: string;
            path: string;
            fullPath: string;
            dist: string;
            svelte: string;
        };
    } = {};

    const nodeNames = new Map<string, string>();

    for (const p of nodeSource) {
        const nodeName = extractNodeName(p, opts.nodeSrc);
        if (nodeName in nodeMap) {
            throw new Error(`${p} is conflicted with ${nodeMap[nodeName].path}`);
        }
        const fullPath = path.resolve(p);
        const noExt = stripExt(fullPath);
        nodeMap[nodeName] = {
            name: nodeName,
            path: p,
            svelte: `${noExt}.svelte`,
            dist: path.join(opts.outDir, `${nodeName}.js`),
            fullPath
        };
        nodeNames.set(noExt, nodeName);
    }

    const nodeRedIcons = new Map<
        string,
        {
            type: 'asset';
            name: string;
            fileName: string;
            source: Uint8Array;
        }
    >();

    const resources = {
        entry: '',
        styles: [] as string[]
    };

    const buildNodeEditor: Plugin = {
        name: 'node-red-editor-build',

        renderStart() {
            if (opts.clean && fs.existsSync(opts.outDir)) {
                fs.rmSync(opts.outDir, { recursive: true });
            }
        },

        load(id) {
            if (id.endsWith('?red-icon')) {
                const realPath = id.slice(0, -9);
                const basename = path.basename(realPath);
                const buffer = fs.readFileSync(realPath);
                const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);
                const name = `${stripExt(basename)}-${hash}${path.extname(basename)}`;
                nodeRedIcons.set(id, {
                    type: 'asset',
                    name: basename,
                    fileName: `icons/${name}`,
                    source: buffer
                });
                return `export default ${JSON.stringify(name)};`;
            }
            if (id.endsWith('?red-res')) {
                const realPath = id.slice(0, -8);
                const basename = path.basename(realPath);
                const buffer = fs.readFileSync(realPath);
                const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);
                const name = `assets/${stripExt(basename)}-${hash}${path.extname(basename)}`;
                this.emitFile({
                    type: 'asset',
                    name: basename,
                    fileName: name,
                    source: buffer
                });
                return `export default ${JSON.stringify(`resources/${pkg.name}/${name}`)};`;
            }
        },

        writeBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
                switch (chunk.type) {
                    case 'chunk': {
                        if (chunk.isEntry) {
                            resources.entry = chunk.fileName;
                        }
                        break;
                    }
                    case 'asset': {
                        if (
                            path.extname(chunk.fileName) === '.css' &&
                            !chunk.fileName.startsWith(`resources/${pkg.name}/assets/`)
                        ) {
                            resources.styles.push(chunk.fileName);
                        }
                    }
                }
            }
            const entryFile = path.join(opts.outDir, 'resources', resources.entry);
            const script = fs.readFileSync(entryFile, 'utf8');
            fs.writeFileSync(
                entryFile,
                script +
                    injectCss(
                        {
                            package: {
                                name: pkg.name,
                                version: pkg.version
                            },
                            styles: resources.styles
                        },
                        { json: JSON.stringify }
                    )
            );
        }
    };

    pkg['node-red'] = pkg['node-red'] ?? {};
    pkg['node-red'].nodes = Object.fromEntries(
        Object.entries(nodeMap).map(
            ([name, node]) =>
                [name, normalizePath(path.relative(opts.outDir, node.dist))] as [string, string]
        )
    );
    pkg.type = 'commonjs';

    const input = Object.fromEntries(
        Object.entries(nodeMap).map(([name, node]) => [name, node.path] as [string, string])
    );

    const postBuild: Plugin = {
        name: 'node-red-backend-post-build',

        generateBundle() {
            for (const asset of nodeRedIcons.values()) {
                this.emitFile(asset);
            }
            for (const node of Object.values(nodeMap)) {
                const noExt = stripExt(node.fullPath);
                const htmlDoc = `${noExt}.html`;
                const mdDoc = `${noExt}.md`;
                let docType = '';
                let docContent: string | undefined = undefined;
                if (fs.existsSync(htmlDoc)) {
                    docType = 'text/html';
                    docContent = fs.readFileSync(htmlDoc, 'utf8');
                } else if (fs.existsSync(mdDoc)) {
                    docType = 'text/markdown';
                    docContent = fs.readFileSync(mdDoc, 'utf8');
                }
                const html = htmlTemplate(
                    {
                        package: {
                            name: pkg.name,
                            version: pkg.version
                        },
                        bundleEntry: resources.entry,
                        name: node.name,
                        docType,
                        docContent
                    },
                    {
                        json: JSON.stringify
                    }
                );
                this.emitFile({
                    type: 'asset',
                    fileName: `${node.name}.html`,
                    source: html
                });
            }
            this.emitFile({
                type: 'asset',
                fileName: 'package.json',
                source: JSON.stringify(pkg, null, 2)
            });
            if (typeof opts.readme === 'string') {
                this.emitFile({
                    type: 'asset',
                    fileName: 'README.md',
                    source: fs.readFileSync(opts.readme, 'utf8')
                });
            }
            if (typeof opts.examplesDir === 'string') {
                const examples = glob(normalizePath(path.join(opts.examplesDir, '**/*')));
                for (const example of examples) {
                    const relative = path.relative(opts.examplesDir, example);
                    const buffer = fs.readFileSync(example);
                    this.emitFile({
                        type: 'asset',
                        fileName: `examples/${relative}`,
                        source: buffer
                    });
                }
            }
        }
    };

    const $package = packageTemplate(pkg, { json: JSON.stringify });

    return [
        {
            input: 'bundle.js',
            output: {
                dir: path.join(opts.outDir, 'resources'),
                format: 'esm',
                entryFileNames: 'bundle-[hash].js',
                chunkFileNames: 'chunk-[hash].js',
                assetFileNames: '[name]-[hash][extname]',
                sourcemap: opts.sourceMap
            },
            plugins: [
                opts.rollupPlugins,
                svelte({
                    emitCss: true,
                    ...opts.svelteOptions
                }),
                commonjs(),
                resolve({
                    browser: true,
                    dedupe: (importee) => importee === 'svelte' || importee.startsWith('svelte/'),
                    preferBuiltins: false,
                    exportConditions: ['svelte'],
                    extensions: ['.svelte', '.js', '.cjs', '.mjs']
                }),
                replace({
                    values: {
                        __NODE_NAME__: (id) => JSON.stringify(nodeNames.get(stripExt(id)))
                    },
                    preventAssignment: true
                }),
                alias({
                    entries: [
                        {
                            find: '$editor',
                            replacement: path.resolve(editorLibDir)
                        },
                        {
                            find: '$shared',
                            replacement: path.resolve(sharedLibDir)
                        },
                        {
                            find: '$package.json',
                            replacement: path.resolve('./package.js')
                        }
                    ]
                }),
                virtual({
                    'bundle.js': entryTemplate(
                        {
                            package: {
                                name: pkg.name,
                                version: pkg.version
                            },
                            imports: Object.values(nodeMap)
                        },
                        { json: JSON.stringify }
                    ),
                    'package.js': $package
                }),
                css(),
                buildNodeEditor
            ],
            external: opts.editorExternalDeps
        },
        {
            input,
            output: {
                dir: opts.outDir,
                format: 'cjs',
                entryFileNames: '[name].js',
                chunkFileNames: 'lib/[name]-[hash].js',
                assetFileNames: '[name]-[hash][extname]',
                sourcemap: opts.sourceMap
            },
            plugins: [
                opts.rollupPlugins,
                resolve(),
                commonjs(),
                replace({
                    values: {
                        __NODE_NAME__: (id) => JSON.stringify(nodeNames.get(stripExt(id)))
                    },
                    preventAssignment: true
                }),
                alias({
                    entries: [
                        {
                            find: '$lib',
                            replacement: path.resolve(libDir)
                        },
                        {
                            find: '$shared',
                            replacement: path.resolve(sharedLibDir)
                        },
                        {
                            find: '$package.json',
                            replacement: path.resolve('./package.js')
                        }
                    ]
                }),
                virtual({
                    'package.js': $package
                }),
                postBuild
            ],
            external: opts.nodeExternalDeps
        }
    ];
}
