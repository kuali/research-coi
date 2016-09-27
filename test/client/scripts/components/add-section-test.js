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
import AddSection from '../../../../client/scripts/components/add-section';
import assert from 'assert';

describe('AddSection', () => {
  it('should hide message div if no message is provided', () => {
    const wrapper = shallow(
      <AddSection />
    );

    assert(wrapper.find('#message').node.props.className.indexOf('hideWarning') > 0);
  });

  it('should display message div if a message is provided', () => {
    const wrapper = shallow(
      <AddSection
        message="message"
      />
    );

    assert(wrapper.find('#message').node.props.className.indexOf('hideWarning') === -1);
  });
});
