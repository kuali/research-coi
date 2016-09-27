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
import assert from 'assert';
import sd from 'skin-deep';
import {BackToDashBoardButton} from '../../../../../../client/scripts/components/user/travel-log/back-to-dash-board-button';

/*global describe, it */

describe('BackToDashBoardButton', () => {
  it('render button', () => {
    const tree = sd.shallowRender(
      <BackToDashBoardButton />
    );

    const vdom = tree.getRenderOutput();
    assert.equal('Back Button', vdom.props.name);
  });
});
