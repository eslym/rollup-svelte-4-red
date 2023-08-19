<script>
    import AutoComplete from './AutoComplete.svelte';
    import SelectType from './typed-input/SelectType.svelte';
    import ValueHelper from './ValueHelper.svelte';

    export let value;
    export let types;
    export let error = false;

    $: selectedType = types[$value.type];
</script>

<div class="red-ui-typedInput-container rs4r-typedinput" class:input-error={error}>
    <SelectType bind:type={$value.type} {types} />
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
            <div class=red-ui-typedInput-input-wrap>
                <ValueHelper bind:value={$value.value} let:_value>
                    <AutoComplete
                        value={_value}
                        suggestions={selectedType.suggestions}
                        className="red-ui-typedInput-input"
                    />
                </ValueHelper>
            </div>
        {/if}
    {/if}
</div>
