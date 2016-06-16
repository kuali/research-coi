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

/*global describe, it, beforeEach */
/* eslint-disable no-magic-numbers */
import alt from '../../../../client/scripts/alt';
import assert from 'assert';
import {AdminStore} from '../../../../client/scripts/stores/admin-store';
import {AdminActions} from '../../../../client/scripts/actions/admin-actions';
import { DATE_TYPE } from '../../../../coi-constants';

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
            {id: 1, name: 'reviewer'}
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

  describe('toggleReviewer', () => {
    it('should toggle value of reviewerVisible', () => {
      setApplicationState({
        comment: {
          reviewerVisible: 0
        }
      });

      let reviewerVisible = AdminStore.getState().applicationState.comment.reviewerVisible;

      assert.equal(0, reviewerVisible);

      alt.dispatcher.dispatch({
        action: AdminActions.TOGGLE_REVIEWER
      });

      reviewerVisible = AdminStore.getState().applicationState.comment.reviewerVisible;

      assert.equal(1, reviewerVisible);
    });
  });

  describe('toggleReporter', () => {
    it('should toggle value of piVisible', () => {
      setApplicationState({
        comment: {
          piVisible: 0
        }
      });

      let piVisible = AdminStore.getState().applicationState.comment.piVisible;

      assert.equal(0, piVisible);

      alt.dispatcher.dispatch({
        action: AdminActions.TOGGLE_REPORTER
      });

      piVisible = AdminStore.getState().applicationState.comment.piVisible;

      assert.equal(1, piVisible);
    });
  });

  describe('updateCommentText', () => {
    it('should update comment text to value passed in', () => {
      setApplicationState({
        comment: {
          text: ''
        }
      });

      let text = AdminStore.getState().applicationState.comment.text;

      assert.equal('', text);

      const value = 'test';
      alt.dispatcher.dispatch({
        action: AdminActions.UPDATE_COMMENT_TEXT,
        data: {target: {value}}
      });

      text = AdminStore.getState().applicationState.comment.text;

      assert.equal(value, text);
    });
  });

  describe('editComment', () => {
    it('should pull value from comments array and insert it into comment', () => {
      setApplicationState({
        currentComments: [
          {
            id: 1,
            text: 'test',
            piVisible: 1,
            reviewerVisible: 1
          }
        ],
        comment: {
          text: '',
          piVisible: 0,
          reviewerVisible: 0
        }
      });

      let applicationState = AdminStore.getState().applicationState;

      assert.equal('', applicationState.comment.text);
      assert.equal(0, applicationState.comment.piVisible);
      assert.equal(0, applicationState.comment.reviewerVisible);

      assert.equal(undefined, applicationState.commentSnapShot);
      assert.equal(1, applicationState.currentComments.length);
      alt.dispatcher.dispatch({
        action: AdminActions.EDIT_COMMENT,
        data: 1
      });

      applicationState = AdminStore.getState().applicationState;
      assert.equal('test', applicationState.comment.text);
      assert.equal(1, applicationState.comment.piVisible);
      assert.equal(1, applicationState.comment.reviewerVisible);

      assert.equal('test', applicationState.commentSnapShot.text);
      assert.equal(1, applicationState.commentSnapShot.piVisible);
      assert.equal(1, applicationState.commentSnapShot.reviewerVisible);

      assert.equal(0, applicationState.currentComments.length);
    });
  });

  describe('updateCommentState', () => {
    it('should pull value from comments array and insert it into comment', () => {
      setApplicationState({
        selectedDisclosure: {
          comments: []
        },
        comment: {
          text: 'dsdfsd',
          piVisible: 1,
          reviewerVisible: 1,
          topicSection: 'test',
          topicId: 'test',
          title: 'test'
        },
        commentSnapShot: {
          text: 'dsdfsd',
          piVisible: 1,
          reviewerVisible: 1
        },
        editingComment: true
      });

      let applicationState = AdminStore.getState().applicationState;

      alt.dispatcher.dispatch({
        action: AdminActions.UPDATE_COMMENT_STATE,
        data: [
          {
            text: 'dsdfsd',
            piVisible: 1,
            reviewerVisible: 1
          }
        ]
      });

      applicationState = AdminStore.getState().applicationState;

      //reset comment state
      assert.equal('', applicationState.comment.text);
      assert.equal(0, applicationState.comment.piVisible);
      assert.equal(0, applicationState.comment.reviewerVisible);
      assert.equal('test', applicationState.comment.topicSection);
      assert.equal('test', applicationState.comment.topicId);
      assert.equal('test', applicationState.comment.title);

      //clear comment snapshot
      assert.equal(undefined, applicationState.commentSnapShot);

      //add comment to comments
      assert.equal(1, applicationState.selectedDisclosure.comments.length);

      //set editting to false
      assert.equal(false, applicationState.editingComment);
    });
  });

  describe('showCommentingPanel', () => {
    let applicationState;

    before(() => {
      setApplicationState({
        listShowing: true,
        commentingPanelShowing: false,
        comment: {},
        commentSnapShot: {
          text: 'dsdfsd',
          piVisible: 1,
          reviewerVisible: 1
        },
        editingComment: undefined
      });

      alt.dispatcher.dispatch({
        action: AdminActions.SHOW_COMMENTING_PANEL,
        data: ['test','test','test']
      });

      applicationState = AdminStore.getState().applicationState;
    });

    it('should set list showing to false', () => {
      assert.equal(false, applicationState.listShowing);
    });

    it('should set commentingPanelSHowing to true', () => {
      assert.equal(true, applicationState.commentingPanelShowing);
    });

    it('should populate comment', () => {
      assert.equal('', applicationState.comment.text);
      assert.equal(0, applicationState.comment.piVisible);
      assert.equal(0, applicationState.comment.reviewerVisible);
      assert.equal('test', applicationState.comment.topicId);
      assert.equal('test', applicationState.comment.topicSection);
      assert.equal('test', applicationState.comment.title);
    });

    it('should set commentSnapShot to undefined', () => {
      assert.equal(undefined, applicationState.commentSnapShot);
    });

    it('should set editingComment to undefined', () => {
      assert.equal(false, applicationState.editingComment);
    });
  });

  describe('updateAdditionalReviewer', () => {
    let reviewer;

    before(() => {
      setApplicationState({
        selectedDisclosure: {
          reviewers: [{
            id: 1,
            active: false,
            dates: []
          }]
        }
      });

      alt.dispatcher.dispatch({
        action: AdminActions.UPDATE_ADDITIONAL_REVIEWER,
        data: 1
      });

      reviewer = AdminStore.getState().applicationState.selectedDisclosure.reviewers[0];
    });

    it('should set reviewer to active', () => {
      assert.equal(true, reviewer.active);
    });

    it('should add a assigned date', () => {
      assert.equal(DATE_TYPE.ASSIGNED, reviewer.dates[0].type);
    });
  });
});
