<script>
    import { writable } from 'svelte/store';
    import Icon from '../../Icon.svelte';
    import RenderType from './RenderType.svelte';
    import { selection } from '../selection.mjs';
    import { createEventDispatcher, getAllContexts } from 'svelte';

    const dispatch = createEventDispatcher();
    const context = getAllContexts();

    export let type;

    export let types;

    export let focusState = false;

    export let disabled = false;

    let isFocused = false;

    const selectionOptions = writable([]);
    const focus = writable(() => {});
    const menuShown = writable(false);

    function keydown(ev) {
        if ($selectionOptions.length <= 1) return;
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

    $: refresh(types, type);

    $: selectedType = types[type];

    $: focusState = isFocused || $menuShown;

    function refresh() {
        $selectionOptions = Object.entries(types).map(([v, t]) => ({
            component: RenderType,
            value: v,
            type: t
        }));
        if (!(type in types)) {
            type = $selectionOptions[0].value;
        }
        const selectedIndex = $selectionOptions.map((o) => o.value).indexOf(type);
        if (selectedIndex !== -1) {
            $selectionOptions[selectedIndex].selected = true;
        }
    }
</script>

<button
    type="button"
    class="red-ui-typedInput-type-select"
    class:red-ui-typedInput-full-width={!selectedType || !(selectedType.hasValue ?? true)}
    {disabled}
    on:click={() => ($menuShown = !$menuShown)}
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
                const old = type;
                type = option.value;
                dispatch('change', {
                    old,
                    new: type
                });
            }
            $menuShown = false;
            dispatch('selected');
        },
        context
    }}
>
    {#if $selectionOptions.length > 1}
        <Icon icon={{ fa4: 'caret-down' }} class="red-ui-typedInput-icon" />
    {/if}
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
