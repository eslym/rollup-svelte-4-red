<script>
    import Icon from '../../Icon.svelte';
    let type;
    export let thumbnail = false;

    export { type as option };
</script>

{#if typeof type.label === 'string'}
    {#if type.icon}
        <Icon icon={type.icon} class="red-ui-typedInput-type-icon" />
    {/if}
    {#if !thumbnail}
        <span class:rs4r-typedinput-padding={!type.icon}>{type.label}</span>
    {/if}
{:else}
    <svelte:component this={type.label} {thumbnail} {type} />
{/if}

<style>
    .rs4r-typedinput-padding {
        padding-left: 18px;
    }
</style>
