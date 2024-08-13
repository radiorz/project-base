const { flatJson } = require('../../dist');
const v = flatJson({ data: { a: { b: { c: 1123 } } } });
console.log(`v`, v);
