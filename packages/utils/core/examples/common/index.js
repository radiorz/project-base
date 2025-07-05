const { flatNestedObject, unflatNestedObject } = require('../../dist');
const v = flatNestedObject({ data: { a: { b: { c: 1123,d: {e:123} } } } });
console.log(`v`, v);
const a = unflatNestedObject({ data: v });
console.log(`a`, a);
