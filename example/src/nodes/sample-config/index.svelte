<script context="module">
    import { version } from '$package.json';

    export function register(render, update, revert) {
        RED.nodes.registerType(__NODE_NAME__, {
            category: 'config',
            defaults: {
                name: {
                    value: ''
                },
                _version: {
                    value: version
                }
            },
            credentials: {
                password: {
                    type: 'password',
                    label: 'Password'
                }
            },
            label() {
                return this.name || this.id;
            },
            paletteLabel: 'Example Config',
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
<Input bind:node type="password" prop="password" label="Password" credentials />
