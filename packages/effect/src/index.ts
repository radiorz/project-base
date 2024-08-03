import { doEffect } from '../lib';
doEffect({ c: 1 }, [
  function (c) {
    c.a = 1;
    console.log(`1.s`, c);
    const a = 123;
    return function (c) {
      console.log(`a`, a);
      c.a = 2;
      console.log(`1.b`, c);
    };
  },
  function (c) {
    c.b = 1;
    console.log(`2.s`, c);
    return (c) => {
      c.b = 2;
      console.log(`2,b`, c);
    };
  },
]);
