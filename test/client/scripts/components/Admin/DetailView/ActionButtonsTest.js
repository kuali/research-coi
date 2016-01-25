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
import ActionButtons from '../../../../../../client/scripts/components/Admin/DetailView/ActionButtons';

/*global describe, it */

describe('ActionButtons', () => {
  it('show attachments false readOnly false', () => {
    const tree = sd.shallowRender(
      <ActionButtons
        showAttachments={false}
        readonly={false}
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal(vdom.props.name, 'Action Buttons');
    const children = vdom.props.children;
    assert.equal(children.length, 6);
    assert.equal(children[0], undefined);
    assert.equal(children[1].props.name, 'Approve Button');
    assert.equal(children[2].props.name, 'Send Back Button');
    assert.equal(children[3].props.name, 'Additional Review Button');
    assert.equal(children[4].props.name, 'Review Comments Button');
    assert.equal(children[5].props.name, 'Upload Attachments Button');
  });

  it('show attachments true readOnly false', () => {
    const tree = sd.shallowRender(
      <ActionButtons
        showAttachments={true}
        readonly={false}
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal(vdom.props.name, 'Action Buttons');
    const children = vdom.props.children;
    assert.equal(children.length, 6);
    assert.equal(children[0].props.name, 'General Attachments Button');
    assert.equal(children[1].props.name, 'Approve Button');
    assert.equal(children[2].props.name, 'Send Back Button');
    assert.equal(children[3].props.name, 'Additional Review Button');
    assert.equal(children[4].props.name, 'Review Comments Button');
    assert.equal(children[5].props.name, 'Upload Attachments Button');
  });

  it('show attachments true readOnly true', () => {
    const tree = sd.shallowRender(
      <ActionButtons
        showAttachments={true}
        readonly={true}
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal(vdom.props.name, 'Action Buttons');
    const children = vdom.props.children;
    assert.equal(children.length, 6);
    assert.equal(children[0].props.name, 'General Attachments Button');
    assert.equal(children[1], undefined);
    assert.equal(children[2], undefined);
    assert.equal(children[3].props.name, 'Additional Review Button');
    assert.equal(children[4].props.name, 'Review Comments Button');
    assert.equal(children[5].props.name, 'Upload Attachments Button');
  });

  it('show attachments false readOnly true', () => {
    const tree = sd.shallowRender(
      <ActionButtons
        showAttachments={false}
        readonly={true}
      />
    );

    const vdom = tree.getRenderOutput();
    assert.equal(vdom.props.name, 'Action Buttons');
    const children = vdom.props.children;
    assert.equal(children.length, 6);
    assert.equal(children[0], undefined);
    assert.equal(children[1], undefined);
    assert.equal(children[2], undefined);
    assert.equal(children[3].props.name, 'Additional Review Button');
    assert.equal(children[4].props.name, 'Review Comments Button');
    assert.equal(children[5].props.name, 'Upload Attachments Button');
  });
});
