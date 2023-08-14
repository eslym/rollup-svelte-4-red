<script>
    import { mergeClass } from './internal/utils.mjs';

    let classes = '';

    export { classes as class };
</script>

<div class={mergeClass(classes)}>
    <slot />
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        gap: 5px;
        margin-bottom: 12px;
        align-items: center;
    }

    div > :global(label):first-child:not(:only-child) {
        display: block;
        width: 100px;
        height: fit-content;
    }

    div > :global(label):only-child {
        width: 100%;
    }

    div > :global(*) {
        width: auto;
        height: auto;
        margin: 0;
    }
</style>
