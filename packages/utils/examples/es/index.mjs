import { flatNestedObject } from '../../dist/index.mjs';
const v = flatNestedObject({ data: { a: { b: { c: 1123 } } } });
console.log(`v`, v);
