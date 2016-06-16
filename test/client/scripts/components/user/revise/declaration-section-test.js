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
import DeclarationSection from '../../../../../../client/scripts/components/user/revise/declaration-section';

/*global describe, it */


describe('DeclarationSection', () => {
  it('render colorblind mode off', () => {
    const tree = sd.shallowRender(
      <DeclarationSection
        declarationsToReview={[{id: 1}]}
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal('Declaration Section', vdom.props.name);
  });

  it('render colorblind mode on', () => {
    global.window.colorBlindModeOn = true;
    const tree = sd.shallowRender(
      <DeclarationSection
        declarationsToReview={[{id: 1}]}
      />
    );
    global.window.colorBlindModeOn = false;
    const vdom = tree.getRenderOutput();
    assert.equal('Declaration Section', vdom.props.name);
  });
});
