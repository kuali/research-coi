/*
 The Conflict of Interest (COI) module of Kuali Research
 Copyright © 2005-2016 Kuali, Inc.

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

import React from 'react';
import { shallow } from 'enzyme';
import { ROLES } from '../../../../../../coi-constants';
import CommentBubble from '../../../../../../client/scripts/components/admin/detail-view/comment-bubble';
import assert from 'assert';

function createComment(userRole, piVisible, reviewerVisible) {
  return {
    text: 'test',
    userRole,
    date: new Date(),
    piVisible,
    reviewerVisible
  };
}

describe('CommentBubble', () => {
  it('should render admin bubble if from user', () => {
    const wrapper = shallow(
      <CommentBubble
        {...createComment(ROLES.USER,1,1)}
      />
    );

    assert.equal(wrapper.find('#adminBubble').length, 1);
    assert.equal(wrapper.find('#reporterBubble').length, 0);
    assert.equal(wrapper.find('#reviewerBubble').length, 0);
  });

  it('should render admin bubble if piVisible and reviewerVisible are false', () => {
    const wrapper = shallow(
      <CommentBubble
        {...createComment(ROLES.ADMIN,0,0)}
      />
    );

    assert.equal(wrapper.find('#adminBubble').length, 1);
    assert.equal(wrapper.find('#reporterBubble').length, 0);
    assert.equal(wrapper.find('#reviewerBubble').length, 0);
  });

  it('should render reporter bubble if piVisible is true and reviewerVisible is false', () => {
    const wrapper = shallow(
      <CommentBubble
        {...createComment(ROLES.ADMIN,1,0)}
      />
    );

    assert.equal(wrapper.find('#adminBubble').length, 0);
    assert.equal(wrapper.find('#reporterBubble').length, 1);
    assert.equal(wrapper.find('#reviewerBubble').length, 0);
  });

  it('should render reviewer bubble if piVisible is false and reviewerVisible is true', () => {
    const wrapper = shallow(
      <CommentBubble
        {...createComment(ROLES.ADMIN,0,1)}
      />
    );

    assert.equal(wrapper.find('#adminBubble').length, 0);
    assert.equal(wrapper.find('#reporterBubble').length, 0);
    assert.equal(wrapper.find('#reviewerBubble').length, 1);
  });

  it('should render reviewer and reporter bubble if piVisible is true and reviewerVisible is true', () => {
    const wrapper = shallow(
      <CommentBubble
        {...createComment(ROLES.ADMIN,1,1)}
      />
    );

    assert.equal(wrapper.find('#adminBubble').length, 0);
    assert.equal(wrapper.find('#reporterBubble').length, 1);
    assert.equal(wrapper.find('#reviewerBubble').length, 1);
  });

});
