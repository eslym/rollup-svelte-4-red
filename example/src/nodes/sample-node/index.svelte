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
                json: {
                    value: 'null',
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
    import { JSONEditor } from 'svelte-jsoneditor';
    import { openTypeEditor } from '@eslym/rs4r/tray';

    export let node;

    function openEditor() {
        openTypeEditor(JSONEditor, {
            title: 'Some JSON Value',
            props: {
                content: {
                    text: node.json
                },
                onChange(updatedContent, _, { contentErrors }) {
                    if (!contentErrors) {
                        node.json =
                            updatedContent.text !== undefined
                                ? updatedContent.text
                                : JSON.stringify(updatedContent.json);
                        console.log(node.json);
                    }
                }
            },
            buttons: [
                {
                    text: RED._('common.label.back'),
                    click() {
                        RED.tray.close();
                    }
                }
            ]
        });
    }
</script>

<Input bind:node type="text" prop="name" label="Name" />
<Input bind:node type="config" prop="config" label="Config" />

<label>
    Some JSON Value<br />
    <textarea bind:value={node.json} />
</label>
<button on:click={openEditor}>Open Editor</button>

<img src={example} alt="example" />

<style>
    textarea {
        width: 100%;
        resize: vertical;
    }
</style>
