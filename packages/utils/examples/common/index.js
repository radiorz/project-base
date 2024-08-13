const { flatJson, unflatJson } = require('../../dist');
const v = flatJson({ data: { a: { b: { c: 1123,d: {e:123} } } } });
console.log(`v`, v);
const a = unflatJson({ data: v });
console.log(`a`, a);
