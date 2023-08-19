<script context="module">
    function matchedSource(source, value) {
        return source.filter((s) => s.toLowerCase().includes(value.toLowerCase()));
    }
</script>

<script>
    import { writable } from 'svelte/store';
    import { mergeClass } from './utils.mjs';
    import { createEventDispatcher } from 'svelte';
    import { selection } from './selection.mjs';
    import AutoCompleteSuggestion from './AutoCompleteSuggestion.svelte';

    const dispatch = createEventDispatcher();

    export let value;
    export let placeholder = '';

    export let required = false;
    export let disabled = false;
    export let readonly = false;

    export let suggestions = [];

    export let className = '';

    let menuFocus = writable(() => {});
    let menuShown = writable(false);

    let _suggestions = writable([]);
    let _resolving = false;
    let _needResolve = false;

    let _value;

    /** @type {HTMLInputElement}*/
    let _input;

    async function refreshSuggestions() {
        if (typeof suggestions !== 'function') {
            $_suggestions = (suggestions ?? []).map((o) => ({
                ...(typeof o === 'string' ? { value: o } : o),
                highlighted: '',
                component: AutoCompleteSuggestion
            }));
            if ($value) {
                $_suggestions = $_suggestions
                    .filter((o) => {
                        o.matchedSource = matchedSource(o.source ?? [], $value);
                        if (o.value.toLowerCase().startsWith($value.toLowerCase())) {
                            o.highlighted = o.value.slice(0, $value.length);
                            if (o.matchedSource.length > 0) {
                                o.p = -1;
                            } else {
                                o.p = 0;
                            }
                            return true;
                        }
                        if (o.matchedSource.length > 0) {
                            o.p = 1;
                            return true;
                        }
                        return false;
                    })
                    .sort((a, b) => {
                        return a.p - b.p;
                    });
            }
            if ($_suggestions.length == 0) $menuShown = false;
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
        $_suggestions = (await suggestions($value)).map((o) => ({
            ...(typeof o === 'string' ? { value: o } : o),
            highlighted: $value,
            component: AutoCompleteSuggestion
        }));
        if ($_suggestions.length == 0) $menuShown = false;
        _resolving = false;
        if (_needResolve) {
            return refreshSuggestions();
        }
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
        if (toSuggestion && $menuShown) {
            $menuFocus();
            event.preventDefault();
            return;
        }
        if (
            event.key.length === 1 ||
            event.key === 'Backspace' ||
            event.key === 'Delete' ||
            event.key === 'ArrowDown'
        ) {
            $menuShown = $_suggestions.length > 0;
        } else if (event.key === 'Escape') $menuShown = false;
    }

    function applySuggestion(v) {
        $value = typeof v === 'string' ? v : v.value;
        _input.focus();
        $menuShown = false;
    }

    $: if (_value != $value) {
        _value = $value;
        refreshSuggestions();
    }

    refreshSuggestions();
</script>

<input
    bind:this={_input}
    bind:value={$value}
    class={mergeClass('rs4r-input rs4r-autocomplete', className)}
    type="text"
    {placeholder}
    {required}
    {disabled}
    {readonly}
    autocomplete="off"
    on:change
    on:click
    on:keydown={inputKeydown}
    on:focus
    on:blur
    on:keyup
    on:input
    use:selection={{
        options: _suggestions,
        shown: menuShown,
        focus: menuFocus,
        onSelect: applySuggestion
    }}
/>
