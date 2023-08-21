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
                animal: {
                    value: ''
                },
                typed: {
                    value: {
                        type: 'msg',
                        value: 'payload'
                    },
                    types: {
                        undefined: true,
                        msg: true,
                        str: true,
                        num: true,
                        json: true
                    }
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

    const animals = [
        'Albatross',
        'Antelope',
        'Armadillo',
        'Baboon',
        'Badger',
        'Bat',
        'Bear',
        'Beaver',
        'Bison',
        'Blue Whale',
        'Bonobo',
        'Camel',
        'Capuchin Monkey',
        'Cassowary',
        'Cat',
        'Cheetah',
        'Chimpanzee',
        'Chipmunk',
        'Coyote',
        'Deer',
        'Dog',
        'Dolphin',
        'Donkey',
        'Duck',
        'Eagle',
        'Elephant',
        'Emu',
        'Falcon',
        'Ferret',
        'Flamingo',
        'Fox',
        'Gazelle',
        'Gibbon',
        'Giraffe',
        'Goose',
        'Gorilla',
        'Hawk',
        'Hedgehog',
        'Hippopotamus',
        'Horse',
        'Howler Monkey',
        'Humpback Whale',
        'Jaguar',
        'Kangaroo',
        'Kangaroo Rat',
        'Koala',
        'Lemur',
        'Leopard',
        'Lion',
        'Lynx',
        'Manatee',
        'Mandrill',
        'Marmot',
        'Monkey',
        'Moose',
        'Octopus',
        'Orangutan',
        'Orca',
        'Ostrich',
        'Otter',
        'Panda',
        'Peacock',
        'Pelican',
        'Penguin',
        'Polar Bear',
        'Porcupine',
        'Porpoise',
        'Possum',
        'Rabbit',
        'Raccoon',
        'Reindeer',
        'Rhesus Monkey',
        'Rhinoceros',
        'Sea Lion',
        'Seagull',
        'Seal',
        'Skunk',
        'Sloth',
        'Snake',
        'Spider Monkey',
        'Squirrel',
        'Squirrel Monkey',
        'Swan',
        'Tarsier',
        'Tiger',
        'Turkey',
        'Walrus',
        'Weasel',
        'Wolf',
        'Zebra'
    ];
</script>

<script>
    import { Input, Icon, Row, AutoComplete, tooltip, TypedInput } from '@eslym/rs4r/components';
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
<AutoComplete label="Animal" prop="animal" suggestions={filterAnimals} />
<TypedInput label="Typed Input" prop="typed" />

<Row>
    <label class="textarea">
        Some JSON Value<br />
        <textarea bind:value={node.json} readonly />
        <div>
            <button
                use:tooltip={'Open in JSON editor'}
                type="button"
                class="red-ui-button"
                on:click={openEditor}
            >
                Open Editor <Icon icon={{ fa4: 'external-link' }} />
            </button>
        </div>
    </label>
</Row>

<div>
    <img src={example} alt="example" />
</div>

<style>
    label.textarea {
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
