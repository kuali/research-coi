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

/*global describe, it, beforeEach */
/* eslint-disable no-magic-numbers */
import alt from '../../../../client/scripts/alt';
import assert from 'assert';
import {AdminStore} from '../../../../client/scripts/stores/AdminStore';
import {AdminActions} from '../../../../client/scripts/actions/AdminActions';

const setApplicationState = (data) => {
  alt.dispatcher.dispatch({
    action: AdminActions.SET_APPLICATION_STATE_FOR_TEST, data
  });
};

describe('AdminStore', () => {
  beforeEach(() => {
    alt.recycle(AdminStore);
  });

  describe('setApplicationStateForTest', () => {
    it('should update application state with values passed in', () => {
      setApplicationState({
        selectedDisclosure: {files: []},
        testStuff: true
      });
      const applicationState = AdminStore.getState().applicationState;
      assert(applicationState.selectedDisclosure !== undefined);
      assert.equal(applicationState.testStuff, true);
    });
  });

  describe('showCommentSummary', () => {
    it('should change listShowing to false and commentSummaryShowing to true when showCommentSummary is dispatched', () => {
      const applicationState = AdminStore.getState().applicationState;
      assert.equal(applicationState.listShowing, true);
      assert.equal(applicationState.commentSummaryShowing, false);

      alt.dispatcher.dispatch({
        action: AdminActions.SHOW_COMMENT_SUMMARY,
        data: {}
      });

      assert.equal(applicationState.listShowing, false);
      assert.equal(applicationState.commentSummaryShowing, true);
    });
  });

  describe('showUploadAttachmentsPanel', () => {
    it('should change listShowing to false and uploadAttachemntsShowing to true', () => {
      const applicationState = AdminStore.getState().applicationState;
      assert.equal(applicationState.listShowing, true);
      assert.equal(applicationState.uploadAttachmentsShowing, false);

      alt.dispatcher.dispatch({
        action: AdminActions.SHOW_UPLOAD_ATTACHMENTS_PANEL,
        data: {}});

      assert.equal(applicationState.listShowing, false);
      assert.equal(applicationState.uploadAttachmentsShowing, true);
    });
  });

  describe('hideUploadAttachmentsPanel', () => {
    it('should change listShowing to true and uploadAttachemntsShowing to false', (done) => {
      setApplicationState({
        listShowing: false,
        uploadAttachmentsShowing: true
      });

      const applicationState = AdminStore.getState().applicationState;
      assert.equal(applicationState.listShowing, false);
      assert.equal(applicationState.uploadAttachmentsShowing, true);

      alt.dispatcher.dispatch({
        action: AdminActions.HIDE_UPLOAD_ATTACHMENTS_PANEL,
        data: 5
      });

      setTimeout(() => {
        assert.equal(applicationState.listShowing, true);
        assert.equal(applicationState.uploadAttachmentsShowing, false);
        done();
      }, 5);

    });
  });

  describe('addAdminAttachmentToState', () => {
    it('should add file to files', () => {
      setApplicationState({
        selectedDisclosure: {}
      });

      let files = AdminStore.getState().applicationState.selectedDisclosure.files;

      assert.equal(files, undefined);
      alt.dispatcher.dispatch({
        action: AdminActions.ADD_ADMIN_ATTACHMENT_TO_STATE,
        data: [
          {name: 'file1'},
          {name: 'file2'}
        ]
      });

      files = AdminStore.getState().applicationState.selectedDisclosure.files;

      assert.equal(files.length, 2);
      assert.equal(files[0].name, 'file1');
      assert.equal(files[1].name, 'file2');
    });
  });

  describe('removeAdminAttachmentFromState', () => {
    it('should remove file from files', () => {
      setApplicationState({
        selectedDisclosure: {
          files: [
            {id: 1, name: 'file1'},
            {id: 2, name: 'file2'}
          ]
        }
      });

      let files = AdminStore.getState().applicationState.selectedDisclosure.files;

      assert.equal(files.length, 2);
      assert.equal(files[0].name, 'file1');
      assert.equal(files[1].name, 'file2');

      alt.dispatcher.dispatch({
        action: AdminActions.REMOVE_ADMIN_ATTACHMENT_FROM_STATE,
        data: 1
      });

      files = AdminStore.getState().applicationState.selectedDisclosure.files;

      assert.equal(files.length, 1);
      assert.equal(files[0].name, 'file2');
    });
  });

  describe('addReviewerToState', () => {
    it('should create a reviewer array and add to it', () => {
      setApplicationState({
        selectedDisclosure: {}
      });
      let reviewers = AdminStore.getState().applicationState.selectedDisclosure.reviewers;

      assert.equal(reviewers, undefined);

      alt.dispatcher.dispatch({
        action: AdminActions.ADD_REVIEWER_TO_STATE,
        data: {name: 'reviewer'}
      });

      reviewers = AdminStore.getState().applicationState.selectedDisclosure.reviewers;

      assert.equal(reviewers.length, 1);
      assert.equal(reviewers[0].name, 'reviewer');
    });
  });

  describe('removeReviewerFromState', () => {
    it('should create a reviewer array and add to it', () => {
      setApplicationState({
        selectedDisclosure: {
          reviewers: [
            {id:1, name: 'reviewer'}
          ]
        }
      });

      let reviewers = AdminStore.getState().applicationState.selectedDisclosure.reviewers;

      assert.equal(reviewers.length, 1);
      assert.equal(reviewers[0].name, 'reviewer');

      alt.dispatcher.dispatch({
        action: AdminActions.REMOVE_REVIEWER_FROM_STATE,
        data: 1
      });

      reviewers = AdminStore.getState().applicationState.selectedDisclosure.reviewers;

      assert.equal(reviewers.length, 0);
    });
  });
});
