<script>
    import Icon from '../Icon.svelte';

    export let option;
</script>

{#if option.icon}
    <Icon icon={option.icon} />
{/if}
{option.label ?? option.value}
