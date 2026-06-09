const { stripJsonComments } = require('./main');
const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('stripJsonComments', () => {
  it('should keep regular JSON unchanged', () => {
    const input = '{"a": 1, "b": 2}';
    assert.strictEqual(stripJsonComments(input), input);
  });

  it('should strip single-line comments', () => {
    const input = '{"a": 1, // comment\n "b": 2}';
    const expected = '{"a": 1, \n "b": 2}';
    assert.strictEqual(stripJsonComments(input), expected);
  });

  it('should strip multi-line comments', () => {
    const input = '{"a": 1 /* comment */, "b": 2}';
    const expected = '{"a": 1 , "b": 2}';
    assert.strictEqual(stripJsonComments(input), expected);
  });

  it('should strip multi-line comments across lines', () => {
    const input = '{"a": 1 /* line1\nline2 */, "b": 2}';
    const expected = '{"a": 1 , "b": 2}';
    assert.strictEqual(stripJsonComments(input), expected);
  });

  it('should not strip comments inside strings', () => {
    const input = '{"a": "http://example.com"}';
    assert.strictEqual(stripJsonComments(input), input);
  });

  it('should not strip // inside strings', () => {
    const input = '{"a": "test // not a comment"}';
    assert.strictEqual(stripJsonComments(input), input);
  });

  it('should remove trailing commas before }', () => {
    const input = '{"a": 1,}';
    const result = stripJsonComments(input);
    assert.ok(result.endsWith(' }') || result.endsWith('}'));
    assert.doesNotThrow(() => JSON.parse(result));
  });

  it('should remove trailing commas before ]', () => {
    const input = '[1, 2,]';
    const result = stripJsonComments(input);
    assert.doesNotThrow(() => JSON.parse(result));
  });

  it('should produce valid JSON from JSON with comments', () => {
    const input = `{
      "page": 1, // current page
      "page_size": 10, /* page size */
      "filters": {
        "status": "active" // status filter
      }
    }`;
    const cleaned = stripJsonComments(input);
    assert.doesNotThrow(() => JSON.parse(cleaned));
    const parsed = JSON.parse(cleaned);
    assert.strictEqual(parsed.page, 1);
    assert.strictEqual(parsed.page_size, 10);
    assert.strictEqual(parsed.filters.status, 'active');
  });

  it('should handle empty string', () => {
    assert.strictEqual(stripJsonComments(''), '');
  });
});
