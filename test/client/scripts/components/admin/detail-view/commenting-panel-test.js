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
import CommentingPanel from '../../../../../../client/scripts/components/admin/detail-view/commenting-panel';
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

describe('CommentingPanel', () => {
  it('should only render reporter check when user is reviewer', () => {
    const wrapper = shallow(
      <CommentingPanel
        role={ROLES.REVIEWER}
        comment={createComment(ROLES.ADMIN, 0, 0)}
      />
    );

    assert.equal(0, wrapper.find('#reviewerCheck').length);
    assert.equal(1, wrapper.find('#piCheck').length);
  });

  it('should only render both checks when user is admin', () => {
    const wrapper = shallow(
      <CommentingPanel
        role={ROLES.ADMIN}
        comment={createComment(ROLES.ADMIN, 1, 1)}
      />
    );

    assert.equal(1, wrapper.find('#reviewerCheck').length);
    assert.equal(1, wrapper.find('#piCheck').length);
  });
});
