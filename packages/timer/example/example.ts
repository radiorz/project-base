class A {
  constructor() {
    this.start();
  }
  start() {}
}

class B extends A {
  b: number | undefined = 1
  constructor() {
    super();
    // this.start();
  }
  start() {
    console.log(`start`);
    this.b = 123;
  }
}
const i = new B();
console.log(`i`, i);
