<script>
    import Icon from '../../Icon.svelte';
    export let option;
    export let selection = true;

    $: type = option.type;
</script>

{#if typeof type.label === 'string'}
    <div>
        {#if type.icon}
            <Icon
                icon={type.icon}
                class={{
                    'red-ui-typedInput-icon': true,
                    'rs4r-selected-type-icon': !selection
                }}
            />
        {/if}
        {#if selection || !type.icon || !(type.hasValue ?? true)}
            <span class:rs4r-typedinput-padding={selection && !type.icon}>{type.label}</span>
        {/if}
    </div>
{:else}
    <svelte:component this={type.label} {selection} {type} />
{/if}

<style>
    div {
        display: inline-flex;
        align-items: center;
        height: 100%;
        gap: 5px;
    }
    div :global(.rs4r-selected-type-icon) {
        display: block;
        height: 18px;
        width: 13px;
        margin-right: 4px !important;
    }
    .rs4r-typedinput-padding {
        padding-left: 18px;
    }
</style>
