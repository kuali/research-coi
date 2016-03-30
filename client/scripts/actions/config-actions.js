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

export default alt.generateActions(
  'toggleAutoApprove',
  'setStateForTest',
  'startEditingDeclarationType',
  'stopEditingDeclarationType',
  'toggleDeclarationType',
  'startEnteringNewDeclarationType',
  'deleteInProgressCustomDeclarationType',
  'saveNewDeclarationType',
  'setNewDeclarationTypeText',
  'deleteDeclarationType',
  'enableDisclosureType',
  'disableDisclosureType',
  'enableSponsorLookup',
  'disableSponsorLookup',
  'setDueDate',
  'setIsRollingDueDate',
  'saveNewNotification',
  'deleteNotification',
  'relationshipPeopleChanged',
  'relationshipPeopleEnabled',
  'loadConfig',
  'saveAll',
  'undoAll',
  'cancelNewQuestion',
  'saveNewQuestion',
  'startNewQuestion',
  'updateDeclarationType',
  'updateDisclosureType',
  'questionTypeChosen',
  'questionTextChanged',
  'updateQuestions',
  'deleteQuestion',
  'saveQuestionEdit',
  'startEditingQuestion',
  'cancelQuestionEdit',
  'criteriaChanged',
  'multiSelectOptionAdded',
  'multiSelectOptionDeleted',
  'requiredNumSelectionsChanged',
  'enabledChanged',
  'typeEnabledChanged',
  'amountEnabledChanged',
  'typeOptionsChanged',
  'amountOptionsChanged',
  'destinationEnabledChanged',
  'dateEnabledChanged',
  'reasonEnabledChanged',
  'configureProjectType',
  'configureProjectTypeState',
  'updateRoles',
  'updateStatuses',
  'toggle',
  'set',
  'editNotificationTemplate',
  'doneNotificationTemplate',
  'cancelNotificationTemplate'
);
