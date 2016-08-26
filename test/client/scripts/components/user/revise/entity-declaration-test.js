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
import {MockPIReviewActions} from './mocks/mock-pi-review-actions';
import {MockPIReviewStore} from './mocks/mock-pi-review-store';
import configState from '../../../../config-context';
import EntityDeclaration from '../../../../../../client/scripts/components/user/revise/entity-declaration';
EntityDeclaration.__Rewire__('PIReviewActions', MockPIReviewActions); //eslint-disable-line no-underscore-dangle

const entityWithComments = {
  id: 1,
  projectId: 3,
  reviewId: 1,
  comments: [{id: 1, author: 'Kuali Joe', text: 'comment', date: new Date()}],
  adminComments: [{id: 1, author: 'Kuali Joe', text: 'admin comment', date: new Date()}],
  piResponse: {text: 'test'},
  reviewedOn: new Date()
};

const entityWithOutComments = {
  id: 2,
  projectId: 4,
  reviewId: 1,
  comments: [],
  adminComments: [],
  reviewedOn: null
};

const renderEntityDelcaration = (entity, revising, responding) => {
  return sd.shallowRender(
    <EntityDeclaration
      key={1}
      entity={entity}
      revising={revising}
      responding={responding}
    />,
    configState
  );
};

describe('EntityDeclaration', () => {
  it('render without comments, not revising, not responding', () => {
    const tree = renderEntityDelcaration(entityWithOutComments, false, false);
    const vdom = tree.getRenderOutput();
    assert.equal('Entity Declaration',vdom.props.name);
  });

  it('render without comments, colorblind mode on', () => {
    global.window.colorBlindModeOn = true;
    const tree = renderEntityDelcaration(entityWithOutComments, false, false);
    global.window.colorBlindModeOn = false;
    const vdom = tree.getRenderOutput();
    assert.equal('Entity Declaration',vdom.props.name);
  });

  it('render with comments, not revising, not responding', () => {
    const tree = renderEntityDelcaration(entityWithComments, false, false);
    const vdom = tree.getRenderOutput();
    assert.equal('Entity Declaration',vdom.props.name);
  });

  it('render with comments revising', () => {
    const tree = renderEntityDelcaration(entityWithComments, true, false);
    const vdom = tree.getRenderOutput();
    assert.equal('Entity Declaration',vdom.props.name);
  });

  it('render with comments responding', () => {
    const tree = renderEntityDelcaration(entityWithComments, false, true);
    const vdom = tree.getRenderOutput();
    assert.equal('Entity Declaration',vdom.props.name);
  });

  it('revise method', () => {
    const tree = renderEntityDelcaration(entityWithComments, false, false);
    const instance = tree.getMountedInstance();
    assert.equal(false, instance.state.revising);
    instance.revise();
    assert.equal(true, instance.state.revising);
  });

  it('respond method', () => {
    const tree = renderEntityDelcaration(entityWithComments, false, false);
    const instance = tree.getMountedInstance();
    assert.equal(false, instance.state.responding);
    instance.respond();
    assert.equal(true, instance.state.responding);
  });

  it('cancel method', () => {
    const tree = renderEntityDelcaration(entityWithComments, true, true);
    const instance = tree.getMountedInstance();
    instance.cancel();
    assert.equal(false, instance.state.revising);
    assert.equal(false, instance.state.responding);
  });

  it('done method revising', () => {
    const tree = renderEntityDelcaration(entityWithComments, true, false);
    const instance = tree.getMountedInstance();
    assert.equal(true, instance.state.revising);
    instance.done();
    const storeState = MockPIReviewStore.getState();
    assert.equal(false, instance.state.revising);
    assert.equal(1, storeState.reviseId);
  });

  it('done method revising', () => {
    const tree = renderEntityDelcaration(entityWithComments, false, true);
    const instance = tree.getMountedInstance();
    instance.refs = {
      responseText: {
        value: 'fdsfds'
      }
    };
    instance.done();
    const storeState = MockPIReviewStore.getState();
    assert.equal(false, instance.state.responding);
    assert.equal(1, storeState.responseId);
  });
});
