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
import { DATE_TYPE } from '../../../../../../coi-constants';
import AdditionalReviewer from '../../../../../../client/scripts/components/admin/detail-view/additional-reviewer';
import assert from 'assert';

function getReviewer() {
  return {
    userId: 1243,
    disclosureId: 1,
    name: 'test',
    email: 'test@test.com',
    dates: [
      {
        type: DATE_TYPE.ASSIGNED,
        date: new Date(2016,0,0)
      }
    ]
  };
}

describe('AdditionalReviewer', () => {
  it('should render the remove button and not the check icon if reviewer has not completed the review', () => {
    const wrapper = shallow(
      <AdditionalReviewer
        readOnly={false}
        {...getReviewer()}
      />
    );

    assert.equal(wrapper.find('#check_icon').length, 0);
    assert.equal(wrapper.find('#remove_button').length, 1);
  });

  it('should remove button should not render if readOnly', () => {
    const wrapper = shallow(
      <AdditionalReviewer
        readOnly={true}
        {...getReviewer()}
      />
    );

    assert.equal(wrapper.find('#check_icon').length, 0);
    assert.equal(wrapper.find('#remove_button').length, 0);
  });

  it('should render check icon and not render remove button if reviewer has completed review', () => {
    const reviewer = getReviewer();
    reviewer.dates.push({type: DATE_TYPE.COMPLETED, date: new Date()});
    const wrapper = shallow(
      <AdditionalReviewer
        readOnly={false}
        {...reviewer}
      />
    );

    assert.equal(wrapper.find('#check_icon').length, 1);
    assert.equal(wrapper.find('#remove_button').length, 0);
  });
});
