<script>
    import * as builtinTypes from './typed-input/builtin-types.mjs';

    import AutoComplete from './AutoComplete.svelte';
    import SelectType from './typed-input/SelectType.svelte';
    import { createEventDispatcher, tick } from 'svelte';
    import Icon from '../Icon.svelte';
    import { mergeClass } from './utils.mjs';

    const dispatch = createEventDispatcher();

    export let value;
    export let types;
    export let error = false;
    export let className = '';

    export let id = undefined;

    let focusSelect = false;
    let focusInput = false;

    let inputElement = undefined;

    let _focus = undefined;

    function onTypeChanged() {}

    $: focus = focusSelect || focusInput;

    $: if (_focus !== focus) {
        if (_focus !== undefined) {
            dispatch(focus ? 'focus' : 'blur');
        }
        _focus = focus;
    }

    $: _types = Object.fromEntries(
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

    $: selectedType = _types[$value.type];

    function expand() {
        if (!selectedType?.expand) return;
        selectedType.expand($value.value, (val) => {
            $value.value = val;
        });
    }
</script>

<div
    class={mergeClass('red-ui-typedInput-container rs4r-typedinput', className)}
    class:red-ui-typedInput-focus={focus}
    class:input-error={error}
>
    <SelectType
        bind:type={$value.type}
        types={_types}
        bind:focusState={focusSelect}
        on:change
        on:selected={() => tick().then(() => inputElement?.focus?.())}
    />
    {#if selectedType}
        {#if selectedType.viewLabel}
            <svelte:component
                this={selectedType.valueLabel}
                bind:value={$value.value}
                type={selectedType}
            />
        {:else if selectedType.options}
            <!-- TODO: make dropdown select -->
        {:else if selectedType.hasValue ?? true}
            <div class="red-ui-typedInput-input-wrap">
                <AutoComplete
                    bind:value={$value.value}
                    suggestions={selectedType.suggestions}
                    className="red-ui-typedInput-input"
                    highlightFocused={false}
                    bind:focusState={focusInput}
                    bind:inputElement
                    {id}
                />
            </div>
            {#if selectedType.expand}
                <button type="button" class="red-ui-typedInput-option-expand" on:click={expand}>
                    <Icon icon={{ fa4: 'ellipsis-h' }} class="red-ui-typedInput-icon" />
                </button>
            {/if}
        {/if}
    {/if}
</div>
