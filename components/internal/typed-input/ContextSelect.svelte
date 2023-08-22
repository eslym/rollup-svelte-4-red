<script>
    import Icon from '../../Icon.svelte';

    export let option;
    export let view = false;
</script>

<Icon icon={{ fa4: 'database' }} class="red-ui-typedInput-icon" />
{#if !view}
    {option.label}
{/if}
