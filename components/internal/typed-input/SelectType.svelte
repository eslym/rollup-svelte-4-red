<script>
    import { writable } from 'svelte/store';
    import Icon from '../../Icon.svelte';
    import RenderType from './RenderType.svelte';
    import { selection } from '../selection.mjs';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let type;

    export let types;

    export let focusState = false;

    let isFocused = false;

    const selectionOptions = writable([]);
    const focus = writable(() => {});
    const menuShown = writable(false);

    function keydown(ev) {
        if ($menuShown) {
            if (ev.key === 'ArrowDown') {
                ev.preventDefault();
                $focus();
            }
            return;
        }
        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            let t = Object.keys(types);
            let next = t.indexOf(type) + 1;
            if (next >= t.length) {
                next = t.length - 1;
            }
            type = t[next];
            dispatch('change');
            return;
        }
        if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            let t = Object.keys(types);
            let next = t.indexOf(type) - 1;
            if (next < 0) {
                next = 0;
            }
            type = t[next];
            dispatch('change');
            return;
        }
    }

    $: $selectionOptions = Object.entries(types).map(([v, t]) => ({
        component: RenderType,
        value: v,
        type: t
    }));

    $: selectedType = types[type];

    $: focusState = isFocused || $menuShown;
</script>

<button
    type="button"
    class="red-ui-typedInput-type-select"
    class:red-ui-typedInput-full-width={!selectedType || !(selectedType.hasValue ?? true)}
    on:click={() => ($menuShown = true)}
    on:focus={() => (isFocused = true)}
    on:blur={() => (isFocused = false)}
    on:keydown={keydown}
    use:selection={{
        options: selectionOptions,
        focus,
        shown: menuShown,
        class: 'rs4r-typedinput-select-options',
        onSelect(option) {
            if (type !== option.value) {
                type = option.value;
                dispatch('change');
            }
            $menuShown = false;
            dispatch('selected');
        }
    }}
>
    <Icon icon={{ fa4: 'caret-down' }} class="red-ui-typedInput-icon" />
    <span class="red-ui-typedInput-type-label rs4r-typedinput-type-label">
        {#if selectedType}
            <!-- svelte-ignore reactive-component -->
            <RenderType option={{ type: selectedType }} selection={false} />
        {/if}
    </span>
</button>

<style>
    :global(.rs4r-typedinput-select-options) > :global(button) {
        padding: 6px 18px 6px 6px !important;
    }
</style>
