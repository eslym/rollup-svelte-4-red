<svelte:options accessors={true} />

<script>
    import { onMount } from 'svelte';
    import Text from './Text.svelte';
    import { onresize } from './actions.mjs';

    export let shown = false;
    export let component = Text;
    export let x = 0;
    export let y = 0;
    export let minWidth = 0;

    export let onSelect = undefined;

    export let target;

    export let width = 0;
    export let height = 0;

    export let container;

    export let options;

    function updateSize() {
        const bounding = container.getBoundingClientRect();
        width = bounding.width;
        height = bounding.height;
    }

    function selectionKeydown(ev) {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') {
            this.nextElementSibling?.focus?.();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') {
            if (this.previousElementSibling) this.previousElementSibling.focus();
            else if (target.tagName === 'INPUT') target.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'Home') {
            container.firstChild.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'End') {
            container.lastChild.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'Escape') {
            target.focus();
            shown = false;
            return;
        }
        if (
            target.tagName === 'INPUT' &&
            (ev.key.length === 1 ||
                ev.key === 'Tab' ||
                ev.key === 'Backspace' ||
                ev.key === 'Delete')
        ) {
            target.focus();
            const newKeydown = new KeyboardEvent('keydown', ev);
            target.dispatchEvent(newKeydown);
            return;
        }
    }

    export function isFocus() {
        return container && container.matches(':focus-within');
    }

    onMount(updateSize);

    $: panelStyle = `left:${x}px;top:${y}px;min-width:${minWidth}px;`;
</script>

<div
    class=" rs4r-panel red-ui-panel"
    class:shown
    bind:this={container}
    use:onresize={updateSize}
    style={panelStyle}
>
    {#each options as option}
        <button
            type="button"
            tabindex="-1"
            on:click={() => onSelect?.(option)}
            on:keydown={selectionKeydown}
        >
            {#if typeof option === 'string'}
                <svelte:component this={component} value={option} />
            {:else if typeof option === 'object'}
                <svelte:component this={option.component} {option} />
            {/if}
        </button>
    {/each}
</div>

<style>
    .rs4r-panel {
        display: none;
        position: fixed;
        box-sizing: border-box;
        max-height: 200px;
        overflow: auto;
        box-shadow: 1px 1px 4px var(--red-ui-shadow);
        font-family: var(--red-ui-primary-font);
        font-size: var(--red-ui-primary-font-size);
        border: 1px solid var(--red-ui-primary-border-color);
        background: var(--red-ui-secondary-background);
        z-index: 2000;
    }
    .rs4r-panel.shown {
        display: block;
    }
    .rs4r-panel > button {
        all: unset;
        box-sizing: border-box;
        width: 100%;
        display: block;
        padding: 4px 8px 4px 16px;
        clear: both;
        font-weight: normal;
        line-height: 20px;
        color: var(--red-ui-menuColor);
        white-space: nowrap;
        text-decoration: none;
    }
    .rs4r-panel > button:focus,
    .rs4r-panel > button:hover {
        color: var(--red-ui-menuHoverColor);
        text-decoration: none;
        background-color: var(--red-ui-menuHoverBackground);
        border: none;
        outline: none;
    }
</style>
