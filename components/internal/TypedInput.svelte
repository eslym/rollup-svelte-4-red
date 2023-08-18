<script>
    import SelectType from './typed-input/SelectType.svelte';

    export let value;
    export let types;
    export let error = false;

    $: selectedType = types[$value.type];
</script>

<div class="red-ui-typedInput-container" class:input-error={error}>
    <SelectType bind:type={$value.type} {types} />
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
