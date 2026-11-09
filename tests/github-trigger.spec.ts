import { expect, it } from 'vitest'
import { mentions } from '../src/sources/github-trigger.ts'

/** `[text, expected, why]`; the login is `alice` unless a case is about the login's own case. */
const cases: [text: string, expected: boolean, why: string][] = [
  ['hi @alice', true, 'after a space'],
  ['@alice hi', true, 'at the start of the text'],
  ['@alice', true, 'as the whole text'],
  ['@Alice hi', true, 'case-insensitively'],
  ['hello (@alice)', true, 'after punctuation in a sentence'],
  ['hi @alice, please fix', true, 'before punctuation'],
  ['@alice2 hi', false, 'a longer login shares the prefix'],
  ['@alice_1', false, 'an underscore continues the login'],
  ['@alice-b', false, 'a hyphen continues the login'],
  ['@alicebot', false, 'a longer login without a separator'],
  ['foo@alice.com', false, 'an email local part precedes the @'],
  ['user@alice', false, 'an alphanumeric precedes the @'],
]

it('detects a mention of the login only when the text around it does not extend it', () => {
  for (const [text, expected, why] of cases) expect([text, why, mentions(text, 'alice')]).toEqual([text, why, expected])
})

it('compares the login case-insensitively whichever side carries the case', () => {
  expect(mentions('hi @alice', 'Alice')).toBe(true)
  expect(mentions('hi @ALICE', 'Alice')).toBe(true)
})
