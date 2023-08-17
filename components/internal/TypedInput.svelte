<script>
    import Icon from '../Icon.svelte';

    export let value;
    export let types;
    export let error = false;

    $: selectedType = types[$value.type];
</script>

<div class="red-ui-typedInput-container" class:input-error={error}>
    <button
        type="button"
        class="red-ui-typedInput-type-select"
        class:red-ui-typedInput-full-width={!(selectedType.hasValue ?? true)}
    >
        <Icon icon={{ fa4: 'caret-down' }} class="red-ui-typedInput-type-icon" />
        <span class="red-ui-typedInput-type-label">
            {#if selectedType.icon}
                <Icon icon={selectedType.icon} class="red-ui-typedInput-type-icon" />
            {:else if typeof selectedType.label === 'string'}
                {selectedType.label}
            {:else}
                <svelte:component
                    this={selectedType.label}
                    thumbnail
                    {...selectedType.props ?? {}}
                    value={$value.value}
                />
            {/if}
        </span>
    </button>
    {#if selectedType.hasValue ?? true}
        {#if selectedType.options !== undefined}
            <button
                type="button"
                class="red-ui-typedInput-option-trigger rs4s-typedinput-value-select"
            />
        {/if}
    {/if}
</div>

<style>
    .rs4s-typedinput-value-select {
        display: inline-flex;
        flex-grow: 1;
    }
</style>
