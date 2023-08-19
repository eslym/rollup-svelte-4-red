<script>
    import { writable } from 'svelte/store';
    import Icon from '../../Icon.svelte';
    import RenderType from './RenderType.svelte';
    import { selection } from '../selection.mjs';

    export let type;

    export let types;

    const selectionOptions = writable([]);
    const focus = writable(() => {});
    const menuShown = writable(false);

    $: $selectionOptions = Object.entries(types).map(([v, t]) => ({
        component: RenderType,
        value: v,
        type: t
    }));

    $: selectedType = types[type];
</script>

<button
    type="button"
    class="red-ui-typedInput-type-select"
    class:red-ui-typedInput-full-width={!selectedType || !(selectedType.hasValue ?? true)}
    on:click={() => ($menuShown = true)}
    use:selection={{
        options: selectionOptions,
        focus,
        shown: menuShown,
        class: 'rs4r-typedinput-select-options',
        onSelect(option) {
            type = option.value;
            $menuShown = false;
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
    .rs4r-typedinput-type-label{
        margin-right: 4px;
    }
</style>
