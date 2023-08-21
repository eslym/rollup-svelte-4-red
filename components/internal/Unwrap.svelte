<script>
    export let value;
    export let component;
</script>

<svelte:component
    this={component}
    bind:value={$value}
    {...$$restProps}
    on:change
    on:click
    on:focus
    on:blur
    on:keydown
    on:keyup
    on:input><slot /></svelte:component
>
