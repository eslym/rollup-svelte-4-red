<script>
    import Row from './Row.svelte';
    import Inline from './internal/Inline.svelte';
    import InternalInput from './internal/Input.svelte';
    import Config from './internal/Config.svelte';
    import { mergeClass } from './internal/utils.mjs';
    import ValueHelper from './internal/ValueHelper.svelte';
    import Icon from './Icon.svelte';

    export let prop = undefined;
    export let label = undefined;
    export let placeholder = undefined;
    export let type = 'text';
    export let config = false;
    export let value = undefined;
    export let inline = false;
    export let disabled = false;
    export let required = false;
    export let novalidate = false;
    export let icon = undefined;

    let className = '';

    export { className as class };

    $: wrapper = inline ? Inline : Row;
</script>

<ValueHelper
    bind:value
    {prop}
    {type}
    {config}
    {required}
    {novalidate}
    let:_config
    let:_type
    let:_value
    let:_required
    let:_invalid
>
    <svelte:component this={wrapper}>
        {#if _config}
            {#if label}
                {#if _type === 'checkbox' && inline}
                    <label for={undefined}>
                        <Config
                            value={_value}
                            type={_config}
                            {disabled}
                            className={mergeClass({ 'input-error': _invalid }, className)}
                            required={_required}
                            on:change
                            on:click
                            on:focus
                            on:blur
                            on:keydown
                            on:keyup
                            on:input
                        />
                        <span>
                            {#if icon}
                                <Icon {icon} />
                            {/if}
                            {label}
                        </span>
                    </label>
                {:else}
                    <label for={undefined} class:in-row={!inline}>
                        <span>
                            {#if icon}
                                <Icon {icon} />
                            {/if}
                            {label}
                        </span>
                        <Config
                            value={_value}
                            type={_config}
                            {disabled}
                            className={mergeClass({ 'input-error': _invalid }, className)}
                            required={_required}
                            on:change
                            on:click
                            on:focus
                            on:blur
                            on:keydown
                            on:keyup
                            on:input
                        />
                    </label>
                {/if}
            {:else}
                <Config
                    value={_value}
                    type={_config}
                    {disabled}
                    className={mergeClass({ 'input-error': _invalid }, className)}
                    required={_required}
                    on:change
                    on:click
                    on:focus
                    on:blur
                    on:keydown
                    on:keyup
                    on:input
                />
            {/if}
        {:else if label}
            <label class:in-row={!inline}>
                <span>
                    {#if icon}
                        <Icon {icon} />
                    {/if}
                    {label}
                </span>
                <InternalInput
                    type={_type}
                    value={_value}
                    className={mergeClass({ 'input-error': _invalid }, className)}
                    required={_required}
                    {placeholder}
                    {disabled}
                    on:change
                    on:click
                    on:focus
                    on:blur
                    on:keydown
                    on:keyup
                    on:input
                >
                    <slot />
                </InternalInput>
            </label>
        {:else}
            <InternalInput
                type={_type}
                value={_value}
                className={mergeClass({ 'input-error': _invalid }, className)}
                required={_required}
                {placeholder}
                {disabled}
                on:change
                on:click
                on:focus
                on:blur
                on:keydown
                on:keyup
                on:input
            >
                <slot />
            </InternalInput>
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
    label.in-row > span {
        width: 100px;
    }
    label.in-row > :global(input),
    label.in-row > :global(select),
    label.in-row > :global(textarea) {
        flex-grow: 1;
        margin: 0;
    }
</style>
