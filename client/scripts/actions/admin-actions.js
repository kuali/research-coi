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

import alt from '../alt';

export const AdminActions = alt.generateActions(
  'showUploadAttachmentsPanel',
  'hideUploadAttachmentsPanel',
  'addAdminAttachment',
  'deleteAdminAttachment',
  'addAdminAttachmentToState',
  'removeAdminAttachmentFromState',
  'setApplicationStateForTest',
  'changeSort',
  'flipSortDirection',
  'changeTypeFilter',
  'changeSearch',
  'doSearch',
  'setStartDateFilter',
  'setEndDateFilter',
  'clearDateFilter',
  'clearSubmittedByFilter',
  'setSubmittedByFilter',
  'changeReporterFilter',
  'toggleFilters',
  'loadDisclosure',
  'loadArchivedDisclosure',
  'toggleApprovalConfirmation',
  'approveDisclosure',
  'toggleRejectionConfirmation',
  'toggleReturnToReporterConfirmation',
  'updateGeneralComment',
  'rejectDisclosure',
  'returnToReporter',
  'clearTypeFilter',
  'toggleTypeFilter',
  'clearDispositionFilter',
  'toggleDispositionFilter',
  'clearStatusFilter',
  'toggleStatusFilter',
  'clearReviewerFilter',
  'clearReviewStatusFilter',
  'toggleReviewStatusFilter',
  'setReviewerFilter',
  'removeReviewerFilter',
  'setSortDirection',
  'loadMore',
  'hideCommentingPanel',
  'showAdditionalReviewPanel',
  'hideAdditionalReviewPanel',
  'showGeneralAttachmentsPanel',
  'hideGeneralAttachmentsPanel',
  'showCommentSummary',
  'hideCommentSummary',
  'addManagementPlan',
  'deleteManagementPlan',
  'showCommentingPanel',
  'makeComment',
  'toggleCommentViewableByReporter',
  'addAdditionalReviewer',
  'reassignAdditionalReviewer',
  'removeAdditionalReviewer',
  'addReviewerToState',
  'removeReviewerFromState',
  'completeReview',
  'toggleReporter',
  'toggleReviewer',
  'updateCommentText',
  'editComment',
  'cancelComment',
  'updateCommentState',
  'updateProjectDisposition',
  'updateAdditionalReviewer',
  'updateAdminRelationship',
  'updateReviewerRelationship',
  'recommendProjectDisposition',
  'showArchivedDisclosure',
  'closeArchivedDisclosureModal',
  'setAllAdminRelationships',
  'setAllProjectDispositions',
  'setAllRecommendedProjectDispositions',
  'setAllRecommendedDispositions'
);
