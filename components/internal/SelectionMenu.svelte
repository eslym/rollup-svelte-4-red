<svelte:options accessors={true} />

<script>
    import { onMount, tick } from 'svelte';
    import Text from './Text.svelte';
    import { onresize } from './actions.mjs';
    import { mergeClass } from './utils.mjs';

    export let shown;
    export let focus;
    export let component = Text;
    export let minWidth = 0;

    export let onSelect = undefined;

    /** @type {HTMLElement}*/
    export let target;

    export let options;

    let className = '';

    export { className as class };

    let container;

    $focus = () => {
        if ($shown) container?.firstChild?.focus?.();
    };

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
            $shown = false;
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

    export async function refreshPosition() {
        await tick();
        const targetBounding = target.getBoundingClientRect();
        const divBounding = container.getBoundingClientRect();
        if (divBounding.bottom > window.innerHeight) {
            container.style.top = `${targetBounding.top - divBounding.height}px`;
        } else {
            container.style.top = `${targetBounding.bottom}px`;
        }
        if (divBounding.right > window.innerWidth) {
            container.style.left = `${targetBounding.right - divBounding.width}px`;
        } else {
            container.style.left = `${targetBounding.left}px`;
        }
    }

    function focusOut() {
        requestAnimationFrame(() => {
            if (isFocus() || target.matches(':focus-within') || target.matches(':focus')) return;
            $shown = false;
        });
    }

    onMount(refreshPosition);

    $: if (container) container.style.minWidth = `${minWidth}px`;

    $: if ($shown) refreshPosition();
</script>

<div
    class={mergeClass('rs4r-panel red-ui-popover-panel', className)}
    class:rs4r-shown={$shown}
    on:focusout={focusOut}
    bind:this={container}
    use:onresize={refreshPosition}
>
    {#each $options as option}
        <button
            type="button"
            tabindex="-1"
            on:click={() => onSelect?.(option)}
            on:keydown={selectionKeydown}
        >
            {#if typeof option === 'string'}
                <svelte:component this={component} {option} />
            {:else if typeof option === 'object' && option.component}
                <svelte:component this={option.component} {option} />
            {:else}
                <span style="color:red;"><code>option.component</code> is not set!!</span>
            {/if}
        </button>
    {/each}
</div>

<style>
    .rs4r-panel {
        display: block;
        position: fixed;
        box-sizing: border-box;
        max-height: 200px;
        overflow: auto;
        box-shadow: 1px 1px 4px var(--red-ui-shadow);
        font-family: var(--red-ui-primary-font);
        font-size: var(--red-ui-primary-font-size);
        border: 1px solid var(--red-ui-primary-border-color);
        background: var(--red-ui-secondary-background);
        z-index: -2000;
    }
    .rs4r-panel.rs4r-shown {
        z-index: 2000;
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
