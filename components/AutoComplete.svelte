<script>
    import Row from './Row.svelte';
    import Inline from './internal/Inline.svelte';
    import InternalAutoComplete from './internal/AutoComplete.svelte';
    import { mergeClass } from './internal/utils.mjs';
    import ValueHelper from './internal/ValueHelper.svelte';
    import Icon from './Icon.svelte';

    export let prop = undefined;
    export let label = undefined;
    export let placeholder = undefined;
    export let config = false;
    export let value = undefined;
    export let inline = false;
    export let disabled = false;
    export let required = false;
    export let novalidate = false;
    export let icon = undefined;
    export let suggestions = [];

    let className = '';

    export { className as class };

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
                <InternalAutoComplete
                    value={_value}
                    className={mergeClass({ 'input-error': _invalid }, className)}
                    required={_required}
                    {suggestions}
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
            <InternalAutoComplete
                value={_value}
                className={mergeClass({ 'input-error': _invalid }, className)}
                required={_required}
                {suggestions}
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
    label.rs4r-label-in-row > :global(.rs4r-autocomplete) {
        flex-grow: 1;
        margin: 0;
    }
</style>
