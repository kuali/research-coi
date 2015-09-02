/*global describe, it */
import assert from 'assert';

let rewire = require('rewire');
let ConfigUtils = rewire('../../../../client/scripts/stores/ConfigUtils.js');

let sortQuestions = ConfigUtils.__get__('sortQuestions'); //eslint-disable-line no-underscore-dangle

describe('ConfigUtils', () => {
  it('sortQuestions should sort by parent id if exists else sort by id then by id', () => {
    let questions = [{id: 1}, {id: 2}, {id: 3}, {id: 4, parent: 1}, {id: 10, parent: 1}];
    let sortedQuestions = sortQuestions(questions);

    assert.equal(sortedQuestions[1].id, 4);
    assert.equal(sortedQuestions[2].id, 10);
  });
});
