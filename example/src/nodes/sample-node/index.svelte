<script context="module">
    import { version } from '$package.json';
    import icon from '$editor/icons/sample.png?red-icon';
    import example from '$editor/res/example.png?red-res';

    export function register(render, update, revert) {
        RED.nodes.registerType(__NODE_NAME__, {
            category: 'test',
            color: '#eeeeee',
            inputs: 1,
            outputs: 1,
            icon,
            defaults: {
                name: {
                    value: ''
                },
                config: {
                    value: '',
                    type: 'sample-config',
                    required: true
                },
                _version: {
                    value: version
                }
            },
            label() {
                return this.name || this.id;
            },
            paletteLabel: 'Example',
            oneditprepare() {
                render(this);
            },
            oneditsave() {
                // need to return
                return update(this);
            },
            oneditcancel() {
                revert(this);
            }
        });
    }
</script>

<script>
    import { Input } from 'svelte-integration-red/components';

    export let node;
</script>

<Input bind:node type="text" prop="name" label="Name" />
<Input bind:node type="config" prop="config" label="Config" />
<img src={example} alt="example" />
