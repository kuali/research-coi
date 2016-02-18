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
import assert from 'assert';
import sd from 'skin-deep';
import ManagementPlan from '../../../../../../client/scripts/components/user/archive/management-plan';
import { FILE_TYPE } from '../../../../../../coi-constants';

describe('DeclarationSection', () => {
  it('render colorblind mode off', () => {
    const tree = sd.shallowRender(
      <ManagementPlan
        disclosureId='1234'
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal(`/api/coi/files/${FILE_TYPE.MANAGEMENT_PLAN}/1234`, vdom.props.children[1].props.href);
  });
});
