<script>
    import { writable } from 'svelte/store';
    import Icon from '../Icon.svelte';
    import { selection } from './selection.mjs';
    import { createEventDispatcher, getAllContexts } from 'svelte';
    import RenderOption from './RenderOption.svelte';
    import { mergeClass } from './utils.mjs';

    const dispatch = createEventDispatcher();
    const context = getAllContexts();

    export let value;

    export let options;

    export let focusState = false;

    export let className = '';

    export let placeholder = '';

    export let disabled = false;

    export let id = undefined;

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
            let t = Object.keys(valueMap);
            let next = t.indexOf(value) + 1;
            if (next >= t.length) {
                next = t.length - 1;
            }
            value = t[next];
            dispatch('change');
            return;
        }
        if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            let o = Object.keys(valueMap);
            let next = t.indexOf(value) - 1;
            if (next < 0) {
                next = 0;
            }
            value = o[next];
            dispatch('change');
            return;
        }
    }

    $: valueMap = Object.fromEntries(
        (options ?? []).map((v) => {
            if (typeof v === 'string') {
                return [
                    v,
                    {
                        value: v,
                        label: v
                    }
                ];
            }
            return [v.value, v];
        })
    );

    $: if (!placeholder && !(value in valueMap)) {
        value = Object.keys(valueMap)[0];
    }

    $: $selectionOptions = Object.values(valueMap).map((v) => ({
        component: RenderOption,
        ...v
    }));

    $: selectedOption = valueMap[value];

    $: focusState = isFocused || $menuShown;
</script>

<button
    type="button"
    class={mergeClass(className)}
    class:red-ui-typedInput-full-width={!selectedOption || !(selectedOption.hasValue ?? true)}
    {id}
    {disabled}
    on:click={() => ($menuShown = !$menuShown)}
    on:focus={() => (isFocused = true)}
    on:blur={() => (isFocused = false)}
    on:keydown={keydown}
    use:selection={{
        options: selectionOptions,
        focus,
        shown: menuShown,
        onSelect(option) {
            if (value !== option.value) {
                value = option.value;
                dispatch('change');
            }
            $menuShown = false;
            dispatch('selected');
        },
        context
    }}
>
    <span class="rs4r-select-value">
        {#if selectedOption}
            <!-- svelte-ignore reactive-component -->
            <RenderOption option={selectedOption} />
        {:else if placeholder}
            <span class="rs4r-placeholder">{placeholder}</span>
        {/if}
    </span>
    <span class="rs4r-select-caret">
        <Icon icon={{ fa4: 'caret-down' }} />
    </span>
</button>

<style>
    button {
        display: inline-flex;
        align-items: center;
        padding: 0 8px;
    }
    .rs4r-select-value {
        flex-grow: 1;
    }
    .rs4r-placeholder {
        color: var(--red-ui-form-placeholder-color);
    }
</style>
