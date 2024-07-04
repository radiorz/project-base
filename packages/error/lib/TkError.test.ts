import { expect, it } from 'vitest';
import { TkError } from './index';

it('new TkError', async () => {
  const err = new TkError({});
  expect(err).toBeInstanceOf(Error);
  expect(err).toBeInstanceOf(TkError);
  expect(err.message).toBe('');
});
it('message', async () => {
  const err = new TkError({ message: 'hhhh' });
  expect(err.message).toBe('hhhh');
});

it('i18n', async () => {
  const err = new TkError({
    i18n: true,
    i18nAdapter: () => 'hhhh',
  });
  expect(err.message).toBe('hhhh');
});
