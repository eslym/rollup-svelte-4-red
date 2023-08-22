<script>
    export let value;

    let iconClass = [];
    let iconStyle = '';
    let label = '';
    let color;

    $: node = RED.nodes.node(value);

    $: if (node) {
        updateIcon();
    }

    function updateIcon() {
        color = node.type === 'tab' ? '#C0DEED' : RED.utils.getNodeColor(node.type, node._def);
        iconStyle = '';
        label = RED.utils.getNodeLabel(node, node.id);
        let url = RED.utils.getNodeIcon(node._def, node);
        const icon = RED.utils.separateIconPath();
        if (icon.module === 'font-awesome') {
            const unicode = RED.nodes.fontAwesome.getIconUnicode(icon.file);
            fontawesome = true;
            if (unicode) {
                iconClass = ['fa-lg red-ui-palette-icon-fa fa fa-fw', icon.file];
                return;
            }
            url = RED.settings.apiRootUrl + 'icons/node-red/arrow-in.svg';
        } else if (icon.module === 'red-ui-icons') {
            iconClass = ['red-ui-palette-icon red-ui-icons', icon.file];
            return;
        }
        iconStyle = `background-image: url(${url});`;
    }
</script>

<div class="red-ui-search-result-node" class:rs4r-empty={!node} style="background-color: {color};">
    {#if node}
        <div class="red-ui-palette-icon-container">
            {#if iconStyle}
                <div class="red-ui-palette-icon" style={iconStyle} />
            {:else}
                <i class={iconClass} />
            {/if}
        </div>
    {/if}
</div>
<span>{label}</span>

<style>
    .rs4r-empty {
        border-style: dashed;
        background-color: #eee !important;
    }
    .red-ui-search-result-node {
        margin-top: 2px;
        margin-left: 3px;
    }
    span {
        line-height: 32px;
        margin-left: 3px;
    }
</style>
