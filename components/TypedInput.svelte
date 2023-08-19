<script context="module">
    import * as builtinTypes from './internal/typed-input/builtin-types.mjs';
    export { builtinTypes };
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
>
    <svelte:component this={wrapper}>
        {#if label}
            <label class:rs4r-label-in-row={!inline} for={undefined}>
                <span>
                    {#if icon}
                        <Icon {icon} />
                    {/if}
                    {label}
                </span>
                <InternalTypedInput
                    value={_value}
                    error={_invalid}
                    required={_required}
                    {types}
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
            </label>
        {:else}
            <InternalTypedInput
                value={_value}
                error={_invalid}
                required={_required}
                {types}
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
    label {
        display: flex;
        align-items: center;
        gap: 5px;
        width: 100%;
    }
    label.rs4r-label-in-row > span {
        width: 100px;
    }
    label.rs4r-label-in-row > :global(.rs4r-typedinput) {
        flex-grow: 1;
        margin: 0;
    }
</style>
