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
        gap: 6px;
        margin-bottom: 12px;
    }
</style>
