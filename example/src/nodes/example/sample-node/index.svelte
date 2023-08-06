<script context="module">
    import icon from '../../../../res/sample.png?red-icon';

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
                    type: 'example.config',
                    required: true
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
