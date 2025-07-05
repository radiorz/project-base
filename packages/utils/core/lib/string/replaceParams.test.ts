import { it, expect } from 'vitest';
import { replaceParams } from './replaceParams';

it('replaceParams', () => {
  // 一个变量
  expect(replaceParams('{app}', { app: 'hahah' })).toBe('hahah');
  // 两个变量
  expect(replaceParams(`{app}/{org}`, { app: 'hahah', org: 'nnn' })).toBe('hahah/nnn');
  // 一个变量但写两次
  expect(replaceParams(`{org}/{org}`, { org: 'nnn' })).toBe('nnn/nnn');
  // 变量没值 keepMatch=false
  expect(replaceParams(`{org}`, {})).toBe('');
  expect(replaceParams(`{org}`, { org: null })).toBe('');

  // 变量没值 keepMatch=true
  expect(replaceParams(`{org}`, {}, { keepMatch: true })).toBe('{org}');
  expect(replaceParams(`{org}`, { org: { a: 1 } }, { keepMatch: true, stringify: false })).toBe('[object Object]');
});
