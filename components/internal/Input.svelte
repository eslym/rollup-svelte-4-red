<script>
    import { mergeClass } from './utils.mjs';

    export let type;
    export let value;
    export let placeholder;
    export let disabled = false;
    export let required = false;
    export let className = '';
</script>

{#if type === 'checkbox'}
    <label>
        <input
            type="checkbox"
            bind:checked={$value}
            {disabled}
            {required}
            class={mergeClass('rs4r-input rs4r-checkbox', className)}
            on:change
            on:click
            on:focus
            on:blur
            on:keydown
            on:keyup
            on:input
        />
        {#if placeholder}<span>{placeholder}</span>{/if}
    </label>
{:else if type === 'password'}
    <input
        type="password"
        bind:value={$value}
        {placeholder}
        {disabled}
        {required}
        class={mergeClass('rs4r-input', className)}
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:input
    />
{:else if type === 'number'}
    <input
        type="number"
        bind:value={$value}
        {placeholder}
        {disabled}
        {required}
        class={mergeClass('rs4r-input', className)}
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:input
    />
{:else if type === 'textarea'}
    <textarea
        bind:value={$value}
        {placeholder}
        {disabled}
        {required}
        class={mergeClass('rs4r-input rs4r-textarea', className)}
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:input
    />
{:else if type === 'select'}
    <select
        bind:value={$value}
        {placeholder}
        {disabled}
        {required}
        class={mergeClass('rs4r-input rs4r-select', className)}
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:input
    >
        <slot />
    </select>
{:else}
    <input
        type="text"
        bind:value={$value}
        {placeholder}
        {disabled}
        {required}
        class={mergeClass('rs4r-input', className)}
        autocomplete="off"
        on:change
        on:click
        on:focus
        on:blur
        on:keydown
        on:keyup
        on:input
    />
{/if}

<style>
    input[type='checkbox'] {
        width: auto;
        margin: 0;
    }
</style>
