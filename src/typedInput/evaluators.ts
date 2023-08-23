import type { NodeMessage } from 'node-red';
import type { RS4RNodeWrapper } from '..';
import { error } from '../error';

export function msg(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return this.RED.util.getMessageProperty(msg, value);
}

export function flow(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    const ctx = this.RED.util.parseContextStore(value);
    if (/\[msg/.test(ctx.key)) {
        ctx.key = this.RED.util.normalisePropertyExpression(ctx.key, msg, true);
    }
    return this.flow.get(ctx.key, ctx.store);
}

export function global(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    const ctx = this.RED.util.parseContextStore(value);
    if (/\[msg/.test(ctx.key)) {
        ctx.key = this.RED.util.normalisePropertyExpression(ctx.key, msg, true);
    }
    return this.global.get(ctx.key, ctx.store);
}

export function str(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return value;
}

export function num(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return value ? Number(value) : undefined;
}

export function bool(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return value === 'true';
}

export function json(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return JSON.parse(value);
}

export function env(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return this.RED.util.evaluateEnvProperty(value, this.node);
}

export function bin(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    const arr = JSON.parse(value);
    if (Array.isArray(arr) || typeof arr === 'string') {
        return Buffer.from(arr);
    }
    return error('INVALID_BUFFER_DATA', 'Not string or array');
}

export function re(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return new RegExp(value);
}

export function date(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return Date.now();
}

export function jsonata(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    const expr = this.RED.util.prepareJSONataExpression(value, this.node);
    return this.RED.util.evaluateJSONataExpression(expr, msg);
}

export function undefined(this: RS4RNodeWrapper, msg: NodeMessage, value: string) {
    return void 0;
}
