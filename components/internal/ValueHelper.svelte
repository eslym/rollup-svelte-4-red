<script>
    import { getContext, onDestroy } from 'svelte';
    import { writable, derived, get } from 'svelte/store';
    import { editingNodeContextKey } from '@eslym/rs4r/runtime';
    import isEqual from 'lodash.isequal';

    export let prop = undefined;
    export let type = undefined;
    export let config = undefined;
    export let value = undefined;
    export let required = undefined;
    export let novalidate = undefined;

    let _config = false;
    let _credential = false;
    let _value = writable(value);
    let _bindVal = false;
    let _type = type;
    let _required = required;
    let _invalid = false;

    let _cleanup = new Set();
    let state = undefined;

    const editingNode = getContext(editingNodeContextKey) ?? writable(undefined);

    function validateValue(v, validator) {
        if (novalidate) {
            _invalid = false;
        }
        let req = false;
        if (
            _required &&
            (v === '' || v === undefined || v === null || (Array.isArray(v) && !v.length))
        ) {
            req = true;
        }
        return req || (validator ? !validator(v) : false);
    }

    function sync(p, t, c, r) {
        if (
            state !== undefined &&
            state.prop === p &&
            state.type === t &&
            state.config === c &&
            state.required === r
        ) {
            return;
        }
        state = {
            prop,
            type,
            config,
            required
        };
        cleanup();
        if (prop !== undefined && !$editingNode) {
            throw new Error('Input with prop must be used inside a node editor');
        }
        if (prop === undefined) {
            cleanup();
            if (config) {
                const def = RED.nodes.getType(config);
                if (def.category !== 'config') {
                    throw new Error(`Node type ${config} is not a config node`);
                }
                _config = config;
            }
            _type = type;
            _value = writable(value);
            validateValue(value);
            _cleanup.add(
                _value.subscribe((val) => {
                    validateValue(val);
                    if (isEqual(value, val)) return;
                    value = val;
                })
            );
            _bindVal = true;
            return;
        }
        _bindVal = false;
        const defs = $editingNode._def;
        const propDef = defs.defaults[prop] ?? defs.credentials[prop];
        if (!propDef) {
            throw new Error(`Property ${prop} not found in node ${node.type}`);
        }
        _credential = !!defs.credentials?.[prop];
        _required = propDef.required ?? required;
        _type = type;
        if (_credential) {
            if (propDef.type !== 'password') {
                if (!['password', 'text', 'textarea'].includes(type)) {
                    _type = 'text';
                }
                _value = writable($editingNode.credentials[prop]);
                _cleanup.add(
                    _value.subscribe((v) => {
                        validateValue(v, propDef.validate);
                        if (isEqual($editingNode.credentials[prop], v)) return;
                        $editingNode.credentials[prop] = v;
                    })
                );
                _cleanup.add(
                    editingNode.subscribe((node) => {
                        if (isEqual(node.credentials[prop], get(_value))) return;
                        _value.set(node.credentials[prop]);
                    })
                );
                return;
            }
            let val = $editingNode.credentials[prop];
            let _val = writable(val);
            let _display = derived(_val, (v) => {
                if (typeof v === 'string') {
                    return v;
                }
                return $editingNode.credentials[`has_${prop}`] ? '__PWRD__' : '';
            });
            _value = {
                subscribe: (a, b) => _display.subscribe(a, b),
                update: (a) => _val.update(a),
                set: (a) => _val.set(a)
            };
            _type = 'password';
            _cleanup.add(
                _val.subscribe((v) => {
                    validateValue(v, propDef.validate);
                    if (isEqual($editingNode.credentials[prop], v)) return;
                    $editingNode.credentials[prop] = v;
                    $editingNode.credentials[`has_${prop}`] = !!v;
                })
            );
            _cleanup.add(_display.subscribe((v) => validateValue(v, propDef.validate)));
            _cleanup.add(
                editingNode.subscribe((node) => {
                    if (isEqual($editingNode.credentials[prop], get(_val))) return;
                    _val.set(node.credentials[prop]);
                })
            );
            return;
        }
        _value = writable($editingNode[prop]);
        _cleanup.add(
            _value.subscribe((v) => {
                validateValue(v, propDef.validate);
                if (isEqual($editingNode[prop], v)) return;
                $editingNode[prop] = v;
            })
        );
        _cleanup.add(
            editingNode.subscribe((node) => {
                if (isEqual(node[prop], get(_value))) return;
                _value.set(node[prop]);
            })
        );
        _config = 'type' in propDef ? propDef.type : false;
    }

    $: sync(prop, type, config, required);

    $: if (_bindVal && !isEqual(value, $_value)) {
        $_value = value;
    }

    function cleanup() {
        for (const action of _cleanup) {
            action();
            _cleanup.delete(action);
        }
    }

    onDestroy(cleanup);
</script>

<slot {_config} {_type} {_value} {_required} {_invalid} />
