const msgCompletions = [
    { value: 'payload' },
    { value: 'topic', source: ['mqtt', 'inject', 'rbe'] },
    { value: 'action', source: ['mqtt'] },
    { value: 'complete', source: ['join'] },
    { value: 'contentType', source: ['mqtt'] },
    { value: 'cookies', source: ['http request', 'http response'] },
    { value: 'correlationData', source: ['mqtt'] },
    { value: 'delay', source: ['delay', 'trigger'] },
    { value: 'encoding', source: ['file'] },
    { value: 'error', source: ['catch'] },
    { value: 'error.message', source: ['catch'] },
    { value: 'error.source', source: ['catch'] },
    { value: 'error.source.id', source: ['catch'] },
    { value: 'error.source.type', source: ['catch'] },
    { value: 'error.source.name', source: ['catch'] },
    { value: 'filename', source: ['file', 'file in'] },
    { value: 'flush', source: ['delay'] },
    { value: 'followRedirects', source: ['http request'] },
    { value: 'headers', source: ['http response', 'http request'] },
    { value: 'host', source: ['tcp request', 'http request'] },
    { value: 'ip', source: ['udp out'] },
    { value: 'kill', source: ['exec'] },
    { value: 'messageExpiryInterval', source: ['mqtt'] },
    { value: 'method', source: ['http request'] },
    { value: 'options', source: ['xml'] },
    { value: 'parts', source: ['split', 'join', 'batch', 'sort'] },
    { value: 'pid', source: ['exec'] },
    { value: 'port', source: ['tcp request', ' udp out'] },
    { value: 'qos', source: ['mqtt'] },
    { value: 'rate', source: ['delay'] },
    { value: 'rejectUnauthorized', source: ['http request'] },
    { value: 'req', source: ['http in'] },
    { value: 'req.body', source: ['http in'] },
    { value: 'req.headers', source: ['http in'] },
    { value: 'req.query', source: ['http in'] },
    { value: 'req.params', source: ['http in'] },
    { value: 'req.cookies', source: ['http in'] },
    { value: 'req.files', source: ['http in'] },
    { value: 'requestTimeout', source: ['http request'] },
    { value: 'reset', source: ['delay', 'trigger', 'join', 'rbe'] },
    { value: 'responseCookies', source: ['http request'] },
    { value: 'responseTopic', source: ['mqtt'] },
    { value: 'responseUrl', source: ['http request'] },
    { value: 'restartTimeout', source: ['join'] },
    { value: 'retain', source: ['mqtt'] },
    { value: 'schema', source: ['json'] },
    { value: 'select', source: ['html'] },
    { value: 'statusCode', source: ['http response', 'http request'] },
    { value: 'status', source: ['status'] },
    { value: 'status.text', source: ['status'] },
    { value: 'status.source', source: ['status'] },
    { value: 'status.source.type', source: ['status'] },
    { value: 'status.source.id', source: ['status'] },
    { value: 'status.source.name', source: ['status'] },
    { value: 'target', source: ['link call'] },
    { value: 'template', source: ['template'] },
    { value: 'toFront', source: ['delay'] },
    { value: 'url', source: ['http request'] },
    { value: 'userProperties', source: ['mqtt'] },
    { value: '_session', source: ['websocket out', 'tcp out'] }
];

const contextParse = function (v, defaultStore) {
    var parts = RED.utils.parseContextKey(v, defaultStore && defaultStore.value);
    return {
        option: parts.store,
        value: parts.key
    };
};

const contextExport = function (v, opt) {
    if (!opt) {
        return v;
    }
    var store = typeof opt === 'string' ? opt : opt.value;
    if (store !== RED.settings.context.default) {
        return '#:(' + store + ')::' + v;
    } else {
        return v;
    }
};

export const msg = {
    label: 'msg.',
    validate: RED.utils.validatePropertyExpression,
    suggestions: msgCompletions
};

export const flow = {
    label: 'flow.',
    hasValue: true,
    options: [],
    validate: RED.utils.validatePropertyExpression,
    parse: contextParse,
    export: contextExport,
    valueLabel: Symbol('placeholder') /* TODO: make component */
};

export const global = {
    label: 'global.',
    hasValue: true,
    options: [],
    validate: RED.utils.validatePropertyExpression,
    parse: contextParse,
    export: contextExport,
    valueLabel: Symbol('placeholder') /* TODO: make component */
};

export const string = {
    label: 'string',
    icon: { maskSvg: 'red/images/typedInput/az.svg' }
};

export const number = {
    label: 'number',
    icon: { maskSvg: 'red/images/typedInput/09.svg' },
    validate: (v) => /^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/.test(v)
};

export const bool = {
    label: 'boolean',
    icon: { maskSvg: 'red/images/typedInput/bool.svg' },
    options: [
        {
            label: 'true',
            value: 'true'
        },
        {
            label: 'false',
            value: 'false'
        }
    ]
};

export const json = {
    label: 'JSON',
    icon: { maskSvg: 'red/images/typedInput/json.svg' },
    validate: (v) => {
        try {
            JSON.parse(v);
            return true;
        } catch (e) {
            return false;
        }
    },
    expand: function (value, update) {
        try {
            value = JSON.stringify(JSON.parse(value), null, 4);
        } catch (err) {}
        RED.editor.editJSON({
            value: value,
            stateId: RED.editor.generateViewStateId('typedInput', undefined, 'json'),
            focus: true,
            complete: function (v) {
                let value = v;
                try {
                    value = JSON.stringify(JSON.parse(v));
                } catch (err) {}
                update(value);
            }
        });
    }
};

export const regex = {
    label: 'regular expression',
    icon: { svgMask: 'red/images/typedInput/re.svg' }
};

export const timestamp = {
    label: 'timestamp',
    icon: { fa4: 'clock-o' },
    hasValue: false
};

export const jsonata = {
    label: 'expression',
    icon: { svgMask: 'red/images/typedInput/expr.svg' },
    validate: function (v) {
        try {
            jsonata(v);
            return true;
        } catch (e) {
            return false;
        }
    },
    expand: function (value, update) {
        RED.editor.editExpression({
            value: value.replace(/\t/g, '\n'),
            stateId: RED.editor.generateViewStateId('typedInput', undefined, 'jsonata'),
            focus: true,
            complete: function (v) {
                update(v.replace(/\n/g, '\t'));
            }
        });
    }
};

export const bin = {
    label: 'buffer',
    icon: { svgMask: 'red/images/typedInput/bin.svg' },
    expand: function (value, update) {
        RED.editor.editBuffer({
            value: value,
            stateId: RED.editor.generateViewStateId('typedInput', undefined, 'bin'),
            focus: true,
            complete: function (v) {
                update(v);
            }
        });
    }
};

export const env = {
    label: 'env variable',
    icon: { svgMask: 'red/images/typedInput/env.svg' }
};

export const node = {
    label: 'node',
    icon: { svgMask: 'red/images/typedInput/target.svg' },
    valueLabel: Symbol('placeholder') /* TODO: make a component */,
    expand: function (value, update) {
        RED.tray.hide();
        RED.view.selectNodes({
            single: true,
            selected: [value],
            onselect: function (selection) {
                update(selection.id);
                RED.tray.show();
            },
            oncancel: function () {
                RED.tray.show();
            }
        });
    }
};

// TODO:
export const credentials = Symbol('placeholder');
