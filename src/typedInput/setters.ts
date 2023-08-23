import type { NodeMessage } from 'node-red';
import type { RS4RNodeWrapper } from '..';

export function msg(this: RS4RNodeWrapper, msg: NodeMessage, property: string, value: string) {
    return this.RED.util.setObjectProperty(msg, property, value, true);
}

export function flow(this: RS4RNodeWrapper, msg: NodeMessage, property: string, value: string) {
    const ctx = this.RED.util.parseContextStore(property);
    if (/\[msg/.test(ctx.key)) {
        ctx.key = this.RED.util.normalisePropertyExpression(ctx.key, msg, true);
    }
    return this.flow.set(ctx.key, value, ctx.store);
}

export function global(this: RS4RNodeWrapper, msg: NodeMessage, property: string, value: string) {
    const ctx = this.RED.util.parseContextStore(property);
    if (/\[msg/.test(ctx.key)) {
        ctx.key = this.RED.util.normalisePropertyExpression(ctx.key, msg, true);
    }
    return this.global.set(ctx.key, value, ctx.store);
}
