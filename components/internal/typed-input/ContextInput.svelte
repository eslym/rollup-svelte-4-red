<script>
    import Select from '../Select.svelte';
    import ContextSelect from './ContextSelect.svelte';

    export let value;
    export let disabled;
    export let inputElement;
    export let id = '';
    export let focusState;

    let _value;

    const stores = RED.settings.context.stores;

    let property = '';
    let store = RED.settings.context.default;

    let focusSelect = false;
    let focusInput = false;

    function spiltContext(v) {
        let parts = RED.utils.parseContextKey(v, RED.settings.context.default);
        store = parts.store;
        property = parts.key;
        _value = v;
    }

    $: contextString = stores.length <= 1 ? property : `#:(${store})::${property}`;

    $: if (value !== contextString) {
        value = contextString;
        _value = value;
    }

    $: if (_value !== value) spiltContext(value);

    $: focusState = focusInput || focusSelect;
</script>

<div class="rs4r-context-input">
    <input
        {id}
        {disabled}
        bind:this={inputElement}
        bind:value={property}
        class="red-ui-typedInput-input"
        on:blur={() => (focusInput = false)}
        on:focus={() => (focusSelect = false)}
    />
    {#if stores.length > 1}
        <div class="rs4r-relative">
            <span class="rs4r-context-label">{store}</span>
        </div>
        <Select
            className="red-ui-typedInput-option-trigger"
            component={ContextSelect}
            bind:focusState={focusSelect}
            bind:value={store}
            options={stores}
            {disabled}
        />
    {/if}
</div>

<style>
    .rs4r-context-input {
        display: flex;
        width: 100%;
    }
    input {
        flex-grow: 1;
        outline: 0;
    }
    .rs4r-relative {
        position: relative;
    }
    .rs4r-context-label {
        position: absolute;
        bottom: -2px;
        right: 5px;
        font-size: 0.7em;
        opacity: 0.3;
    }
</style>
