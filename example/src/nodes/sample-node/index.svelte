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
    import { Input, Icon, Row, menu } from '@eslym/rs4r/components';
    import { JSONEditor } from 'svelte-jsoneditor';
    import { openTypeEditor } from '@eslym/rs4r/tray';

    export let node;

    let animal = '';
    let autocompleteShown = false;

    // 20 examples of animal
    let animals = [
        'Dog',
        'Cat',
        'Elephant',
        'Lion',
        'Giraffe',
        'Dolphin',
        'Kangaroo',
        'Penguin',
        'Tiger',
        'Panda',
        'Zebra',
        'Gorilla',
        'Horse',
        'Cheetah',
        'Snake',
        'Raccoon',
        'Squirrel',
        'Ostrich',
        'Octopus',
        'Koala'
    ].sort();

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

    function filterAnimals(value) {
        return animals.filter((animal) => animal.toLowerCase().startsWith(value.toLowerCase()));
    }
</script>

<Input icon={{ fa4: 'tag' }} prop="name" label="Name" />
<Input icon={{ fa4: 'gear' }} prop="config" label="Config" />
<Row>
    <label for={undefined}>Autocomplete</label>
    <input
        class="animal"
        type="text"
        autocomplete="off"
        bind:value={animal}
        on:keydown={() => (autocompleteShown = true)}
        use:menu={{
            show: autocompleteShown,
            options: filterAnimals(animal),
            width: '200px',
            maxHeight: '300px',
            onclose(_, input) {
                autocompleteShown = false;
                input.focus();
            },
            onselect(val, input) {
                animal = val;
                autocompleteShown = false;
                input.focus();
            }
        }}
    />
</Row>

<Row>
    <label class="textareea">
        Some JSON Value<br />
        <textarea bind:value={node.json} readonly />
        <div>
            <button type="button" class="red-ui-button" on:click={openEditor}>
                Open Editor <Icon icon={{ fa4: 'external-link' }} />
            </button>
        </div>
    </label>
</Row>

<div>
    <img src={example} alt="example" />
</div>

<style>
    input.animal {
        flex-grow: 1;
    }
    label.textareea {
        display: block;
        width: 100%;
    }
    textarea {
        width: 100%;
        resize: vertical;
        margin: 0;
        min-height: 50px;
    }
    img {
        min-width: 300px;
    }
</style>
