declare module '*.tiny.hbs' {
    import type { TinybarsFunc } from '@eslym/tinybars';

    const template: TinybarsFunc;
    export default template;
}
