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
import {findWithType} from 'react-shallow-testutils';
import assert from 'assert';
import AutoApproveDisclosure from '../../../../../../client/scripts/components/config/general/auto-approve-disclosure';

describe('UploadAttachmentsPanel', () => {
  it('should render unchecked if checked is undefined', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <AutoApproveDisclosure
        checked={undefined}
      />
    );
    const component = renderer.getRenderOutput();
    assert.equal(findWithType(component,'input').props.checked, false);
  });

  it('should render unchecked if checked is false', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <AutoApproveDisclosure
        checked={false}
      />
    );
    const component = renderer.getRenderOutput();
    assert.equal(findWithType(component,'input').props.checked, false);
  });

  it('should render checked if checked is true', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <AutoApproveDisclosure
        checked={true}
      />
    );
    const component = renderer.getRenderOutput();
    assert.equal(findWithType(component,'input').props.checked, true);
  });
});
