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

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ShallowTestUtils from 'react-shallow-testutils';
import General from '../../../../../../client/scripts/components/config/general/general';
import {AppHeader} from '../../../../../../client/scripts/components/app-header';
import Sidebar from '../../../../../../client/scripts/components/config/sidebar';
import Panel from '../../../../../../client/scripts/components/config/panel';
import DisclosureTypes from '../../../../../../client/scripts/components/config/general/disclosure-types';
import Checkbox from '../../../../../../client/scripts/components/config/check-box';
import ActionPanel from '../../../../../../client/scripts/components/config/action-panel';
import assert from 'assert';

describe('General', () => {
  it('should render ', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<General/>);
    const component = renderer.getRenderOutput();
    assert(ShallowTestUtils.findWithType(component,AppHeader));
    assert(ShallowTestUtils.findWithType(component,Sidebar));
    assert(ShallowTestUtils.findWithType(component,DisclosureTypes));
    assert.equal(ShallowTestUtils.findAllWithType(component,Panel).length,3);
    assert.equal(ShallowTestUtils.findAllWithType(component,Checkbox).length,3);
    assert(ShallowTestUtils.findWithType(component,ActionPanel));
    const title = ShallowTestUtils.findWithClass(component,
      '_client_scripts_components_config_general_general_style__stepTitle');
    assert.equal(title.props.children, 'General Configuration');
  });
});