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
import TestUtils from 'react-addons-test-utils';
import {findWithType, findAllWithType} from 'react-shallow-testutils';
import General from '../../../../../../client/scripts/components/config/general/general';
import Panel from '../../../../../../client/scripts/components/config/panel';
import DisclosureTypes from '../../../../../../client/scripts/components/config/general/disclosure-types';
import Checkbox from '../../../../../../client/scripts/components/config/check-box';
import configState from '../../../../config-context';
import assert from 'assert';

describe('General', () => {
  it('should render ', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<General/>, configState);
    const component = renderer.getRenderOutput();
    assert(findWithType(component,DisclosureTypes));
    assert.equal(findAllWithType(component,Panel).length,4);
    assert.equal(findAllWithType(component,Checkbox).length,6);
  });
});