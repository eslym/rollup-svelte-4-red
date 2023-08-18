<script>
    import { mergeClass } from './internal/utils.mjs';

    export let icon;
    let className = '';

    export { className as class };
</script>

{#if icon.fa4}
    <i class={mergeClass(`fa fa-${icon.fa4}`, className)} aria-hidden="true" />
{:else if icon.maskSvg}
    <i
        class={mergeClass(className)}
        style="mask-image:url('{icon.maskSvg}');-webkit-mask-image:url('{icon.maskSvg}');"
    />
{/if}
