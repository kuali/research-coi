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
import CheckLink from '../../../../../../client/scripts/components/user/revise/check-link';

describe('CheckLink', () => {
  it('render not checked', () => {
    const tree = sd.shallowRender(
      <CheckLink checked={false}>UNCHECKED</CheckLink>
    );

    const vdom = tree.getRenderOutput();
    assert.equal('UNCHECKED', vdom.props.children[1].props.children);
  });

  it('render checked color blind mode on', () => {
    global.window.colorBlindModeOn = true;
    const tree = sd.shallowRender(
      <CheckLink checked={true}>CHECKED</CheckLink>
    );
    global.window.colorBlindModeOn = false;
    const vdom = tree.getRenderOutput();
    assert.equal('CHECKED', vdom.props.children[1].props.children);
  });

  it('render checked color blind mode off', () => {
    const tree = sd.shallowRender(
      <CheckLink checked={true}>CHECKED</CheckLink>
    );
    const vdom = tree.getRenderOutput();
    assert.equal('CHECKED', vdom.props.children[1].props.children);
  });

  it('render disabled', () => {
    const tree = sd.shallowRender(
      <CheckLink checked={true} disabled={true}>DISABLED</CheckLink>
    );

    const vdom = tree.getRenderOutput();
    assert.equal('DISABLED', vdom.props.children[1].props.children);
  });
});
