<script>
    import { writable } from 'svelte/store';
    import Icon from '../../Icon.svelte';
    import RednerType from './RednerType.svelte';

    export let type;

    export let types;

    let selectionOptions = writable([]);

    $: $selectionOptions = Object.fromEntries(
        Object.entries(type).map(([v, t]) => [
            v,
            {
                ...t,
                value: v,
                component: RednerType
            }
        ])
    );

    $: selectedType = types[type];
</script>

<button
    type="button"
    class="red-ui-typedInput-type-select"
    class:red-ui-typedInput-full-width={!(selectedType.hasValue ?? true)}
>
    <Icon icon={{ fa4: 'caret-down' }} class="red-ui-typedInput-type-icon" />
    <span class="red-ui-typedInput-type-label">
        <!-- svelte-ignore reactive-component -->
        <RednerType option={selectedType} />
    </span>
</button>
