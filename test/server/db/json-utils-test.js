/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

/*global describe, it */
import assert from 'assert';
import _ from 'lodash';

const rewire = require('rewire');
const JsonUtils = rewire('../../../server/db/json-utils.js');

//everything deletegates to izeJson.  Only testing that. It's not exported so I have to use rewire
const izeJson = JsonUtils.__get__('izeJson'); //eslint-disable-line no-underscore-dangle

describe('JsonUtils', () => {

  it('izeJson should return null when null', () => {
    const json = izeJson(null, _.camelCase);
    assert(json === null);
  });

  it('izeJson should throw an error with a null function', () => {
    assert.throws(() => {
      izeJson(null, null);
    }, 'must provide a case function');
  });

  /*eslint-disable camelcase */
  it('izeJson should return camelCase when given a snake_case object with a simple propery and the _.camelCase function', () => {
    const json = izeJson({f_b: 'val'}, _.camelCase);
    assert.equal(json.fB, 'val');
  });

  it('izeJson should return camelCase when given a snake_case object with multiple simple properties and the _.camelCase function', () => {
    const json = izeJson({f_b: 'val', a_b: 'xyz'}, _.camelCase);
    assert.equal(json.fB, 'val');
    assert.equal(json.aB, 'xyz');
  });

  it('izeJson should return camelCase when given a snake_case object with nested objects and the _.camelCase function', () => {
    const json = izeJson({f_b: { a_b: 'xyz'}}, _.camelCase);
    assert.deepEqual(json.fB, { aB: 'xyz'});
  });

  it('izeJson should return camelCase when given a snake_case object with an array of objects and the _.camelCase function', () => {
    const json = izeJson({f_b: [{ a_b: 'xyz'}, {foo_bar: 'baz'}]}, _.camelCase);
    assert.deepEqual(json.fB, [{ aB: 'xyz'}, {fooBar: 'baz'}]);
  });
  /*eslint-enable camelcase */
});
