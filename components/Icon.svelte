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
        class={mergeClass('rs4r-icon-svgmask', className)}
        style="mask-image:url({icon.maskSvg});-webkit-mask-image:url({icon.maskSvg});"
    />
{/if}

<style>
    .rs4r-icon-svgmask {
        display: inline-block;
        -webkit-mask-size: cover;
        mask-size: cover;
        -webkit-mask-position: center;
        mask-position: center;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        background-color: var(--red-ui-primary-text-color);
        height: 14px;
        width: 12px;
    }
</style>
