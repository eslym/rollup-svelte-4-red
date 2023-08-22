export { default as Input } from './Input.svelte';
export { default as Icon } from './Icon.svelte';
export { default as Row } from './Row.svelte';
export { default as AutoComplete } from './AutoComplete.svelte';
export { default as TypedInput } from './TypedInput.svelte';
export { selection } from './internal/selection.mjs';
export * from './internal/actions.mjs';

import TypedInput, { builtinTypes } from './TypedInput.svelte';

TypedInput.builtinTypes = builtinTypes;
