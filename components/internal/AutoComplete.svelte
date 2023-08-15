<script>
    import { mergeClass } from './utils.mjs';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value;
    export let placeholder = '';

    export let required = false;
    export let disabled = false;
    export let readonly = false;

    export let suggestions = [];

    export let className = '';

    let showSuggestions = false;

    let _suggestions = [];
    let _resolving = false;
    let _needResolve = false;

    let _value;

    /** @type {HTMLInputElement}*/
    let _input;

    /** @type {HTMLDivElement}*/
    let _div;

    async function refreshSuggestions() {
        if (typeof suggestions !== 'function') {
            _suggestions = suggestions;
            _resolving = false;
            _needResolve = false;
            return;
        }
        if (_resolving) {
            _needResolve = true;
            return;
        }
        _resolving = true;
        _needResolve = false;
        _suggestions = await suggestions($value);
        _resolving = false;
        if (_needResolve) {
            return refreshSuggestions();
        }
    }

    function focusIn() {
        dispatch('focus');
    }

    function focusOut() {
        if (this.matches(':focus-within')) return;
        dispatch('blur');
        showSuggestions = false;
    }

    function inputKeydown(event) {
        if (!dispatch('keydown', event, { cancelable: true })) {
            event.preventDefault();
            return;
        }
        const cursorLast =
            _input.selectionStart === _input.selectionEnd && _input.selectionEnd === value.length;
        const toSuggestion =
            event.key === 'ArrowDown' || (cursorLast && event.key === 'ArrowRight');
        if (toSuggestion && showSuggestions && suggestions.length) {
            _div.firstChild?.focus?.();
            event.preventDefault();
            return;
        }
        if (
            event.key.length === 1 ||
            event.key === 'Backspace' ||
            event.key === 'Delete' ||
            event.key === 'ArrowDown'
        )
            showSuggestions = true;
        else if (event.key === 'Escape') showSuggestions = false;
    }

    function selectionKeydown(ev) {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') {
            this.nextElementSibling?.focus?.();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') {
            if (this.previousElementSibling) this.previousElementSibling.focus();
            else _input.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'Home') {
            _div.firstChild.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'End') {
            _div.lastChild.focus();
            ev.preventDefault();
            return;
        }
        if (ev.key === 'Escape') {
            _input.focus();
            showSuggestions = false;
            return;
        }
        if (
            ev.key.length === 1 ||
            ev.key === 'Tab' ||
            ev.key === 'Backspace' ||
            ev.key === 'Delete'
        ) {
            _input.focus();
            const newKeydown = new KeyboardEvent('keydown', ev);
            _input.dispatchEvent(newKeydown);
            return;
        }
    }

    function applySuggestion(v) {
        $value = v;
        _input.focus();
        showSuggestions = false;
    }

    $: suggestionShown = showSuggestions && !_resolving && _suggestions.length > 0;

    $: if (_value != $value) {
        _value = $value;
        refreshSuggestions();
    }
</script>

<div class="rs4r-autocomplete" on:focusin={focusIn} on:focusout={focusOut}>
    <input
        bind:this={_input}
        bind:value={$value}
        class={mergeClass(className)}
        type="text"
        {placeholder}
        {required}
        {disabled}
        {readonly}
        autocomplete="off"
        on:change
        on:click
        on:keydown={inputKeydown}
        on:keyup
        on:input
    />
    <div class="rs4r-suggestions-wrapper" class:rs4r-shown={suggestionShown}>
        <div bind:this={_div} class="rs4r-suggestions">
            {#each _suggestions as suggestion}
                <button
                    type="button"
                    tabindex="-1"
                    on:click={applySuggestion(
                        typeof suggestion === 'string' ? suggestion : suggestion.value
                    )}
                    on:keydown={selectionKeydown}
                >
                    {#if typeof suggestion === 'string'}
                        {suggestion}
                    {:else if typeof suggestion === 'object'}
                        <svelte:component
                            this={suggestion.component}
                            input={value}
                            {...suggestion.props ?? {}}
                        />
                    {/if}
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .rs4r-autocomplete {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
    }
    .rs4r-suggestions-wrapper {
        position: absolute;
        display: none;
    }
    .rs4r-suggestions-wrapper.rs4r-shown {
        display: block;
    }
    .rs4r-suggestions {
        position: fixed;
        z-index: 9999;
        background-color: var(--red-ui-form-input-background);
        border: var(--red-ui-form-input-border-color) 1px solid;
        color: var(--red-ui-form-text-color);
        max-height: 200px;
        overflow: auto;
    }
    .rs4r-suggestions > button {
        all: unset;
        box-sizing: border-box;
        display: block;
        width: 100%;
        text-align: left;
        padding: 2px 4px;
    }
    .rs4r-suggestions > button:focus {
        background-color: var(--red-ui-form-input-background-disabled);
    }
    input {
        margin: 0;
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
</style>
