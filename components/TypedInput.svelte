<script context="module">
    import * as builtinTypes from './internal/typed-input/builtin-types.mjs';
    export { builtinTypes };

    let id = 0;

    function getId() {
        return ++id;
    }
</script>

<script>
    import Row from './Row.svelte';
    import ValueHelper from './internal/ValueHelper.svelte';
    import Icon from './Icon.svelte';
    import InternalTypedInput from './internal/TypedInput.svelte';
    import Inline from './internal/Inline.svelte';

    export let prop = undefined;
    export let label = undefined;
    export let placeholder = undefined;
    export let config = false;
    export let value = {};
    export let inline = false;
    export let disabled = false;
    export let required = false;
    export let novalidate = false;
    export let icon = undefined;
    export let types;

    let id = getId();

    $: wrapper = inline ? Inline : Row;
</script>

<ValueHelper
    bind:value
    {prop}
    {config}
    {required}
    {novalidate}
    let:_value
    let:_required
    let:_invalid
    let:_propDef
>
    <svelte:component this={wrapper}>
        {#if label}
            <label class:rs4r-in-row={!inline} for="rs4r-input-{id}">
                {#if icon}
                    <Icon {icon} />
                {/if}
                {label}
            </label>
            <InternalTypedInput
                value={_value}
                error={_invalid}
                required={_required}
                types={_propDef?.types ?? types}
                id="rs4r-input-{id}"
                className={{
                    'rs4r-in-row': !inline
                }}
                {placeholder}
                {disabled}
                on:change
                on:click
                on:focus
                on:blur
                on:keydown
                on:keyup
                on:input
            />
        {:else}
            <InternalTypedInput
                value={_value}
                error={_invalid}
                required={_required}
                types={_propDef?.types ?? types}
                {placeholder}
                {disabled}
                on:change
                on:click
                on:focus
                on:blur
                on:keydown
                on:keyup
                on:input
            />
        {/if}
    </svelte:component>
</ValueHelper>

<style>
    label.rs4r-in-row {
        display: flex;
        align-items: center;
        width: 100px;
    }
    :global(.rs4r-typedinput.rs4r-in-row) {
        flex-grow: 1;
        margin: 0;
    }
</style>
