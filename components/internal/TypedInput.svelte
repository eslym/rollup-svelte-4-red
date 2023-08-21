<script>
    import * as builtinTypes from './typed-input/builtin-types.mjs';

    import AutoComplete from './AutoComplete.svelte';
    import SelectType from './typed-input/SelectType.svelte';
    import ValueHelper from './ValueHelper.svelte';
    import { createEventDispatcher, tick } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value;
    export let types;
    export let error = false;

    let focusSelect = false;
    let focusInput = false;

    let inputElement = undefined;

    let _focus = undefined;

    function onTypeChanged() {}

    $: focus = focusSelect || focusInput;

    $: selectedType = types[$value.type];

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
</script>

<div
    class="red-ui-typedInput-container rs4r-typedinput"
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
                    value={$value.value}
                    suggestions={selectedType.suggestions}
                    className="red-ui-typedInput-input"
                    highlightFocused={false}
                    bind:focusState={focusInput}
                    bind:inputElement
                />
            </div>
        {/if}
    {/if}
</div>
