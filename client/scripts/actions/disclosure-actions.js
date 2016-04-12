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

export const DisclosureActions = alt.generateActions(
  'changeArchiveFilter',
  'loadArchivedDisclosures',
  'changeArchivedQuery',
  'loadDisclosureSummaries',
  'loadDisclosureData',
  'toggleInstructions',
  'submitQuestion',
  'answerQuestion',
  'answerMultiple',
  'answerEntityQuestion',
  'answerEntityMultiple',
  'previousQuestion',
  'setCurrentQuestion',
  'nextStep',
  'newEntityInitiated',
  'setInProgressEntityName',
  'entityFormNextClicked',
  'entityFormBackClicked',
  'addEntityRelationship',
  'entityFormClosed',
  'saveInProgressEntity',
  'changeActiveEntityView',
  'updateEntityFormOpened',
  'editEntity',
  'undoEntityChanges',
  'changeDeclarationView',
  'toggleConfirmationMessage',
  'doneEditingManualEvent',
  'jumpToStep',
  'loadArchivedDisclosureDetail',
  'turnOnValidation',
  'turnOffValidation',
  'certify',
  'submitDisclosure',
  'addDisclosureAttachment',
  'deleteDisclosureAttachment',
  'deleteAnswersTo',
  'setEntityActiveStatus',
  'setEntityType',
  'setEntityPublic',
  'setEntityIsSponsor',
  'setEntityDescription',
  'setEntityRelationshipPerson',
  'setEntityRelationshipTravelAmount',
  'setEntityRelationshipTravelDestination',
  'setEntityRelationshipTravelStartDate',
  'setEntityRelationshipTravelEndDate',
  'setEntityRelationshipTravelReason',
  'setEntityRelationshipRelation',
  'setEntityRelationshipType',
  'setEntityRelationshipAmount',
  'setEntityRelationshipComment',
  'removeEntityRelationship',
  'toggleDeclaration',
  'entityRelationChosen',
  'declarationCommentedOn',
  'setAllForEntity',
  'setAllForProject',
  'manualTypeSelected',
  'saveManualEvent',
  'setArchiveSort',
  'addEntityAttachments',
  'deleteEntityAttachment',
  'resetPotentialRelationship',
  'setStateForTest'
);
