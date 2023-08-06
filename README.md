# Rollup Svelte for RED

Build svelte for Node-RED with rollup, please check the [example](example) for usage.

This project is inspired by and compatible with [svelte-integration-red](https://gitlab.com/2WeltenChris/svelte-integration-red), please check it out for svelte components.

## Project Directory structure

-   `package.json`
-   `rollup.config.js`
-   `src`
    -   `nodes`
        -   `{node-name}`
            -   `index.{md,html}` (node help)
            -   `index.svelte` (node editor UI)
            -   `index.js` (node main file)
    -   `lib` (alias as `$lib`, only exists for back-end)
    -   `editor` (alias as `$editor`, only exists for front-end)

## Aliases

| Alias           | Path           | Description                                                               |
| --------------- | -------------- | ------------------------------------------------------------------------- |
| `$lib`          | `src/lib`      | For back-end, the directory contains all the files that will be bundled.  |
| `$editor`       | `src/editor`   | For front-end, the directory contains all the files that will be bundled. |
| `$package.json` | `package.json` | The package.json file in the project root directory.                      |
| `*?red-icon`    | `*`            | Import as asset name, will auto output to icons directory.                |

## Important

This builder will auto discover all nodes in `src/nodes` directory, add add them into `package.json` in `dist` directorym, so anyone using this builder will need to publish the `dist` directory instead of the project root directory.
