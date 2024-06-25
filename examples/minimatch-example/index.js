import { minimatch } from 'minimatch';

console.log(minimatch('./bar.foo', '*.foo'));
console.log(minimatch('/bar.foo', '*.foo'));
console.log(minimatch('\bar.foo', '*.foo'));
console.log(minimatch('\\bar.foo', '*.foo'));
console.log(minimatch('.\\bar.foo', '*.foo'));
console.log(minimatch('.\\bar.foo', '**/*.foo'));
console.log(minimatch('/bar.foo', '*.foo'));
