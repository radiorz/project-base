import {it, expect} from 'vitest'
import { OptionHandler } from './OptionHandler';
it("option handler ",async ()=>{
 const typedObj = OptionHandler.toType(
   {
     boolean: 'true',
     a: '123',
     b: '1,2,3',
     c: {
       d: '123',
       f: 'aaa',
       e: 'true',
     },
   },
   {
     boolean: 'boolean',
     a: 'number',
     b: 'array',
     c: {
       d: 'number',
       f: 'string',
       e: 'boolean',
     },
   },
 );
 console.log(`typedObj`, typedObj);
 const stringObj = OptionHandler.toString(typedObj);
 console.log(`stringObj`, stringObj);
 
})