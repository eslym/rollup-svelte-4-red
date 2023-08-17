<script>
    export let option;

    $: highlighted = option.value.slice(0, option.highlighted.length);
    $: rest = option.value.slice(option.highlighted.length);
</script>

<div>
    <div class="rs4r-autocomplete-suggestion">
        <span class="rs4r-highlighted">{highlighted}</span><span>{rest}</span>
    </div>
    {#if option.source && option.source.length > 0}
        <div class="rs4r-autocomplete-suggestion-source">{option.source.join(',')}</div>
    {/if}
</div>

<style>
    div {
        font-size: 12px;
        display: flex;
        gap: 5px;
    }
    .rs4r-autocomplete-suggestion {
        display: flex;
        align-items: baseline;
        gap: 0;
        flex-grow: 1;
        overflow: hidden;
        font-family: var(--red-ui-monospace-font);
    }
    .rs4r-highlighted {
        font-weight: bold;
        color: var(--red-ui-text-color-link);
    }
    .rs4r-autocomplete-suggestion-source {
        font-size: 0.8em;
    }
</style>
