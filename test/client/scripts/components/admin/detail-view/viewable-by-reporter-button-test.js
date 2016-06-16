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
import ViewableByReporterButton from '../../../../../../client/scripts/components/admin/detail-view/comment-bubble/viewable-by-reporter-button';
import assert from 'assert';

describe('ViewableByReporterButton', () => {
  const createComponentWrapper = (role, visible) => {
    return shallow(
      <ViewableByReporterButton
        id={3}
        role={role}
        piVisible={visible}
      />
    );
  };

  context('as an admin', () => {
    it('should display the button', () => {
      const wrapper = createComponentWrapper(ROLES.ADMIN, false);
      assert.equal(wrapper.find('button').length, 1);
    });

    it('should display the show button if the comment is currently not visibly by the reporter', () => {
      const wrapper = createComponentWrapper(ROLES.ADMIN, false);
      assert.equal(wrapper.find('button').text(), 'Show to Reporter');
    });

    it('should display the hide button text if the comment is already visible to the reporter', () => {
      const wrapper = createComponentWrapper(ROLES.ADMIN, true);
      assert.equal(wrapper.find('button').text(), 'Hide from Reporter');
    });
  });


  context('as a reviewer', () => {
    it('should not display the button', () => {
      const wrapper = createComponentWrapper(ROLES.REVIEWER, true);
      assert.equal(wrapper.find('button').length, 0);
    });
  });
});
