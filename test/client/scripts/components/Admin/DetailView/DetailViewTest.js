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
import {DetailView} from '../../../../../../client/scripts/components/Admin/DetailView/DetailView';

/*global describe, it */

const renderOutputWithApplicationState = (applicationState) => {
  const tree = sd.shallowRender(
    <DetailView/>
  );

  const instance = tree.getMountedInstance();

  instance.setState({
    applicationState
  });
  return tree.getRenderOutput();
};

describe('DetailView', () => {
  it('list view should be visisble and sidepanel should be hidden', () => {
    const tree = sd.shallowRender(
      <DetailView/>
    );

    const vdom = tree.getRenderOutput();
    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children, undefined);
    assert.equal(vdom.props.className.endsWith('listShowing'), true);
  });

  it('list view should be hidden and sidepanel should be upload attachment', () => {
    const vdom = renderOutputWithApplicationState({
      listShowing: false,
      uploadAttachmentsShowing: true,
      selectedDisclosure: {files:[]}
    });

    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children.type.name.toString(),'UploadAttachmentsPanel');
    assert.equal(vdom.props.className.endsWith('listShowing'), false);
  });

  it('list view should be hidden and sidepanel should be general attachment', () => {
    const vdom = renderOutputWithApplicationState({
      listShowing: false,
      generalAttachmentsShowing: true,
      selectedDisclosure: {files:[]}
    });
    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children.type.name.toString(),'GeneralAttachmentsPanel');
    assert.equal(vdom.props.className.endsWith('listShowing'), false);
  });

  it('list view should be hidden and sidepanel should be commenting panel', () => {
    const vdom = renderOutputWithApplicationState({
      listShowing: false,
      commentingPanelShowing: true,
      selectedDisclosure: {files:[]}
    });
    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children.type.name.toString(),'CommentingPanel');
    assert.equal(vdom.props.className.endsWith('listShowing'), false);
  });

  it('list view should be hidden and sidepanel should be additional review', () => {
    const vdom = renderOutputWithApplicationState({
      listShowing: false,
      additionalReviewShowing: true,
      selectedDisclosure: {files:[]}
    });
    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children.type.name.toString(),'AdditionalReviewPanel');
    assert.equal(vdom.props.className.endsWith('listShowing'), false);
  });

  it('list view should be hidden and sidepanel should be comment summary', () => {
    const vdom = renderOutputWithApplicationState({
      listShowing: false,
      commentSummaryShowing: true,
      selectedDisclosure: {files:[]}
    });
    const sidePanelContainer = vdom.props.children[1].props.children[2];
    assert.equal(sidePanelContainer.props.children.type.name.toString(),'CommentSummary');
    assert.equal(vdom.props.className.endsWith('listShowing'), false);
  });
});
