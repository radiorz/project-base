import { getDateVersion } from '../lib';

console.log(`getDateVersion()`, getDateVersion())
console.log(`getDateVersion({})`, getDateVersion({ pattern: "YYYY.MM.DD" }))
