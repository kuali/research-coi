/*global describe, it */
import assert from 'assert';
import _ from 'lodash';

let rewire = require('rewire');
let JsonUtils = rewire('../../../server/db/JsonUtils.js');

//everything deletegates to izeJson.  Only testing that. It's not exported so I have to use rewire
let izeJson = JsonUtils.__get__('izeJson'); //eslint-disable-line no-underscore-dangle

describe('JsonUtils', () => {

  it('izeJson should return null when null', () => {
    let json = izeJson(null, _.camelCase);
    assert(json == null);
  });

  it('izeJson should throw an error with a null function', () => {
    assert.throws(function() {
      izeJson(null, null);
    }, 'must provide a case function');
  });

  /*eslint-disable camelcase */
  it('izeJson should return camelCase when given a snake_case object with a simple propery and the _.camelCase function', () => {
    let json = izeJson({f_b: 'val'}, _.camelCase);
    assert.equal(json.fB, 'val');
  });

  it('izeJson should return camelCase when given a snake_case object with multiple simple properties and the _.camelCase function', () => {
    let json = izeJson({f_b: 'val', a_b: 'xyz'}, _.camelCase);
    assert.equal(json.fB, 'val');
    assert.equal(json.aB, 'xyz');
  });

  it('izeJson should return camelCase when given a snake_case object with nested objects and the _.camelCase function', () => {
    let json = izeJson({f_b: { a_b: 'xyz'}}, _.camelCase);
    assert.deepEqual(json.fB, { aB: 'xyz'});
  });

  it('izeJson should return camelCase when given a snake_case object with an array of objects and the _.camelCase function', () => {
    let json = izeJson({f_b: [{ a_b: 'xyz'}, {foo_bar: 'baz'}]}, _.camelCase);
    assert.deepEqual(json.fB, [{ aB: 'xyz'}, {fooBar: 'baz'}]);
  });
  /*eslint-enable camelcase */
});
