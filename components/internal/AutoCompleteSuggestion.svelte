<script>
    export let option;

    $: highlighted = option.value.slice(0, option.highlighted.length);
    $: rest = option.value.slice(option.highlighted.length);

    $: matchedSource = option.matchedSource ?? [];
</script>

<div>
    <div class="rs4r-autocomplete-suggestion">
        <span class="rs4r-highlighted">{highlighted}</span><span>{rest}</span>
    </div>
    {#if option.source && option.source.length > 0}
        <div class="rs4r-autocomplete-suggestion-source">
            {#each option.source ?? [] as source}
                <span class:rs4r-highlighted={matchedSource.includes(source)}>{source}</span>
            {/each}
        </div>
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
        display: flex;
        gap: 0;
    }
    .rs4r-autocomplete-suggestion-source span:not(:last-child)::after {
        content: ',';
        color: var(--red-ui-menuColor);
        font-weight: normal;
    }
</style>
