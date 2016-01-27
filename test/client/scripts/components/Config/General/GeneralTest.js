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
import General from '../../../../../../client/scripts/components/Config/General/General';
import {AppHeader} from '../../../../../../client/scripts/components/AppHeader';
import Sidebar from '../../../../../../client/scripts/components/Config/Sidebar';
import Panel from '../../../../../../client/scripts/components/Config/Panel';
import DisclosureTypes from '../../../../../../client/scripts/components/Config/General/DisclosureTypes';
import DueDateDetails from '../../../../../../client/scripts/components/Config/General/DueDateDetails';
import AutoApproveDisclosure from '../../../../../../client/scripts/components/Config/General/AutoApproveDisclosure';
import ActionPanel from '../../../../../../client/scripts/components/Config/ActionPanel';
import assert from 'assert';

/*global describe, it */

describe('UploadAttachmentsPanel', () => {
  it('should render unchecked if checked is undefined', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<General/>);
    const component = renderer.getRenderOutput();
    assert(ShallowTestUtils.findWithType(component,AppHeader));
    assert(ShallowTestUtils.findWithType(component,Sidebar));
    assert(ShallowTestUtils.findWithType(component,DisclosureTypes));
    assert(ShallowTestUtils.findWithType(component,Panel));
    assert(ShallowTestUtils.findWithType(component,DueDateDetails));
    assert(ShallowTestUtils.findWithType(component,AutoApproveDisclosure));
    assert(ShallowTestUtils.findWithType(component,ActionPanel));
    const title = ShallowTestUtils.findWithClass(component,
      '_client_scripts_components_Config_General_General_style__stepTitle');
    assert.equal(title.props.children, 'General Configuration');
  });
});