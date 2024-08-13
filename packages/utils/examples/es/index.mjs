import { flatJson } from '../../dist/index.mjs';
const v = flatJson({ data: { a: { b: { c: 1123 } } } });
console.log(`v`, v);
