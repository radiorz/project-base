import { minimatch } from 'minimatch';

console.log(minimatch('./bar.foo', '*.foo'));
console.log(minimatch('/bar.foo', '*.foo'));
console.log(minimatch('\bar.foo', '*.foo'));
console.log(minimatch('\\bar.foo', '*.foo'));
console.log(minimatch('.\\bar.foo', '*.foo'));
console.log(minimatch('.\\bar.foo', '**/*.foo'));
console.log(minimatch('/bar.foo', '*.foo'));

console.log(`minimatch('package.json','package.json')`, minimatch('package.json', 'package.json'));
console.log(`minimatch('package.json','package.json')`, minimatch('package.json', '**/package.json'));
