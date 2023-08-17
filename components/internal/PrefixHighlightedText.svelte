<script>
    export let value;
    export let highlight;

    $: highlighted = value.slice(0, highlight.length);
    $: rest = value.slice(highlight.length);
</script>

<span class="rs4r-highlighted">{highlighted}</span>{rest}

<style>
    .rs4r-highlighted {
        font-weight: bold;
        color: var(--red-ui-text-color-link);
    }
</style>
