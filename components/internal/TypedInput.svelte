<script context="module">
    function mapTypes(types) {
        if (Array.isArray(types)) {
            return Object.fromEntries(types.map((type) => [type, builtinTypes[type]]));
        }
        return Object.fromEntries(
            Object.entries(types)
                .map(([key, type]) => {
                    switch (typeof type) {
                        case 'object':
                            return [key, type];
                        case 'string':
                            return [key, builtinTypes[type]];
                        default:
                            if (type) {
                                return [key, builtinTypes[key]];
                            }
                            return false;
                    }
                })
                .filter(Boolean)
        );
    }

    export function validator(prop) {
        /** @type {(this: import('node-red').EditorNodeInstance, value: any)=>boolean} */
        return function (value) {
            const types = mapTypes(
                typeof prop === 'string' ? this._def.defaults[prop].types : prop
            );
            if (!(value?.type in types)) {
                return false;
            }
            const validate = types[value.type].validate;
            return validate ? validate.call(this, value.value) : true;
        };
    }
</script>

<script>
    import * as builtinTypes from './typed-input/builtin-types.mjs';

    import AutoComplete from './AutoComplete.svelte';
    import SelectType from './typed-input/SelectType.svelte';
    import { createEventDispatcher, tick } from 'svelte';
    import Icon from '../Icon.svelte';
    import { mergeClass } from './utils.mjs';
    import Select from './Select.svelte';

    const dispatch = createEventDispatcher();

    export let value;
    export let types;
    export let error = false;
    export let className = '';

    export let id = undefined;

    export let disabled = false;

    let focusSelect = false;
    let focusInput = false;

    let inputElement = undefined;

    let focusWithin = false;

    let _focus = undefined;

    $: focus = focusSelect || focusInput || focusWithin;

    $: if (_focus !== focus) {
        if (_focus !== undefined) {
            dispatch(focus ? 'focus' : 'blur');
        }
        _focus = focus;
    }

    $: _types = mapTypes(types);

    $: selectedType = _types[$value.type];

    function expand() {
        if (!selectedType?.expand) return;
        selectedType.expand($value.value, (val) => {
            $value.value = val;
            dispatch('change');
        });
    }

    function onTypeChanged(ev) {
        dispatch('typechange', ev.detail);
        dispatch('change');
    }
</script>

<div
    class={mergeClass('red-ui-typedInput-container rs4r-typedinput', className)}
    class:red-ui-typedInput-focus={focus}
    class:input-error={error}
    on:focusin={() => (focusWithin = true)}
    on:focusout={function () {
        focusWithin = this.matches(':focus-within');
    }}
>
    <SelectType
        bind:type={$value.type}
        types={_types}
        bind:focusState={focusSelect}
        {disabled}
        on:change={onTypeChanged}
        on:selected={() => tick().then(() => inputElement?.focus?.())}
    />
    {#if selectedType}
        {#if selectedType.options && selectedType.options.length > 0}
            <Select
                className="red-ui-typedInput-option-trigger"
                options={selectedType.options}
                bind:focusState={focusInput}
                on:change={() => dispatch('change')}
                {disabled}
                {id}
            />
        {:else if selectedType.hasValue ?? true}
            {#if selectedType.valueLabel}
                <div class="red-ui-typedInput-value-label">
                    <svelte:component
                        this={selectedType.valueLabel}
                        bind:value={$value.value}
                        bind:focusState={focusInput}
                        type={selectedType}
                        {id}
                        bind:inputElement
                        {disabled}
                    />
                </div>
            {:else}
                <div class="red-ui-typedInput-input-wrap">
                    <AutoComplete
                        bind:value={$value.value}
                        suggestions={selectedType.suggestions}
                        className="red-ui-typedInput-input"
                        highlightFocused={false}
                        on:change={() => dispatch('change')}
                        bind:focusState={focusInput}
                        bind:inputElement
                        {disabled}
                        {id}
                    />
                </div>
            {/if}
            {#if selectedType.expand}
                <button
                    type="button"
                    class="red-ui-typedInput-option-expand"
                    on:click={expand}
                    {disabled}
                >
                    <Icon icon={{ fa4: 'ellipsis-h' }} class="red-ui-typedInput-icon" />
                </button>
            {/if}
        {/if}
    {/if}
</div>
