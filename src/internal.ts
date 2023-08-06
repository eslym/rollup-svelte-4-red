import type { EditorRED } from 'node-red';
import type JQuery from 'jquery';
import type { ComponentType } from 'svelte';
import isEqual from 'lodash.isequal';

declare global {
    interface Window {
        $: typeof JQuery;
        RED: EditorRED;
    }
    const RED: EditorRED;
}

type RenderFunc = (node: any, options: { minWidth: string }) => void;
type UpdateFunc = (node: any) => boolean;
type RevertFunc = (node: any) => void;
type AddVersionFunc = (node: any) => void;

interface Entries {
    [name: string]: {
        component: ComponentType;
        register: (
            render: RenderFunc,
            update: UpdateFunc,
            revert: RevertFunc,
            addVersion: AddVersionFunc
        ) => void;
    };
}

const nodeData = new WeakMap<any, any>();

function updateConfigUsers(oldConfig: string, newConfig: string, userId: string) {
    const oldConfigNode = RED.nodes.node(oldConfig) as any;
    const newConfigNode = RED.nodes.node(newConfig) as any;
    if (oldConfigNode) {
        oldConfigNode.users = oldConfigNode.users.filter((userNode: any) => userNode.id !== userId);
    }
    if (newConfigNode && !newConfigNode.users?.find((userNode: any) => userNode.id === userId)) {
        newConfigNode.users.push(RED.nodes.node(userId));
    }
}

export function registerHelper(pack: any, entries: Entries, name: string) {
    const { component, register } = entries[name];

    const render = function (node: any, options: { minWidth: string }) {
        try {
            if (typeof node !== 'object') {
                return;
            }
            let minWidth = '400px';
            if (options) {
                if (options.minWidth) minWidth = options.minWidth;
            }
            if (!nodeData.has(node)) {
                const cloned = window.$.extend(true, {}, node);
                nodeData.set(node, cloned);
            }
            let target = document.getElementById(`${pack.name}/${name}`)!;
            new component({
                target: target,
                props: { node: nodeData.get(node) }
            });
            target.style.width = minWidth;
            const nodeIsSidebarTab = !!node.onchange;
            if (!nodeIsSidebarTab) {
                const orgResize = node._def.oneditresize;
                node._def.oneditresize = function (size: any) {
                    target.style.width = 'auto';
                    if (orgResize) orgResize(size);
                    node._def.oneditresize = orgResize;
                };
            }
        } catch (e) {
            console.error(e);
        }
    };

    const update = function (node: any) {
        if (nodeData.has(node)) {
            const clone = nodeData.get(node);
            nodeData.delete(node);
            clone._version = pack.version;
            let updated = false;
            let refreshSidebar = false;
            const defaultKeys = Object.keys(node._def.defaults || {});
            for (const key of Object.keys(clone)) {
                if (key !== '_version' && defaultKeys.indexOf(key) === -1) continue;
                if (isEqual(node[key], clone[key])) continue;
                if (node._def.defaults[key].type) {
                    refreshSidebar = true;
                    updateConfigUsers(node[key], clone[key], node.id);
                }
                updated = true;
                node[key] = clone[key];
            }
            if (node._) {
                const credentialKeys = Object.keys(node._def.credentials || {});
                for (const key of Object.keys(clone._)) {
                    if (credentialKeys.indexOf(key) === -1) continue;
                    if (isEqual(node._[key], clone._[key])) continue;
                    updated = true;
                    node._[key] = clone._[key];
                }
            }
            if (updated) {
                RED.nodes.updateConfigNodeUsers(node);
                if (refreshSidebar) RED.sidebar.config.refresh();
            }
            return updated;
        }
        return false;
    };

    const revert = function (node: any) {
        if (node.__clone) {
            delete node.__clone;
        }
    };

    const addVersion = function (node: any) {
        node._version = pack.version;
    };

    register(render, update, revert, addVersion);
}
