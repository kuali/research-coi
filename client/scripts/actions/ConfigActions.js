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

import alt from '../alt';

class _ConfigActions {
  startEditingDeclarationType(id) { this.dispatch(id); }

  updateDeclarationType(id, newValue) {
    this.dispatch({id, newValue});
  }

  stopEditingDeclarationType(id) { this.dispatch(id); }

  toggleDeclarationType(id) { this.dispatch(id); }

  startEnteringNewDeclarationType() { this.dispatch(); }

  deleteInProgressCustomDeclarationType() { this.dispatch(); }

  saveNewDeclarationType() { this.dispatch(); }

  setNewDeclarationTypeText(newValue) { this.dispatch(newValue); }

  deleteDeclarationType(id) { this.dispatch(id); }

  enableDisclosureType(typeCd) { this.dispatch(typeCd); }

  disableDisclosureType(typeCd) { this.dispatch(typeCd); }

  updateDisclosureType(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  enableSponsorLookup() { this.dispatch(); }

  disableSponsorLookup() { this.dispatch(); }

  setDueDate(newDate) { this.dispatch(newDate); }

  setIsRollingDueDate(value) { this.dispatch(value); }

  setWarningValueOnNotification(id, newValue) {
    this.dispatch({id, newValue});
  }

  setWarningPeriodOnNotification(id, newValue) {
    this.dispatch({id, newValue});
  }

  setReminderTextOnNotification(id, newValue) {
    this.dispatch({id, newValue});
  }

  saveNewNotification() { this.dispatch(); }

  deleteNotification(id) { this.dispatch(id); }

  questionTypeChosen(category, questionId, type) {
    this.dispatch({
      questionId,
      type,
      category
    });
  }

  questionTextChanged(category, questionId, text) {
    this.dispatch({questionId, text, category});
  }

  updateQuestions(category, questions) {
    this.dispatch({questions, category});
  }

  cancelNewQuestion(category) { this.dispatch({category}); }

  saveNewQuestion(category) { this.dispatch({category}); }

  startNewQuestion(category) { this.dispatch({category}); }

  deleteQuestion(category, questionId) {
    this.dispatch({questionId, category});
  }

  saveQuestionEdit(category, questionId) {
    this.dispatch({questionId, category});
  }

  startEditingQuestion(category, questionId) {
    this.dispatch({questionId, category});
  }

  cancelQuestionEdit(category, questionId) {
    this.dispatch({questionId, category});
  }

  criteriaChanged(category, questionId, newValue) {
    this.dispatch({
      questionId,
      newValue,
      category
    });
  }

  multiSelectOptionAdded(category, questionId, newValue) {
    this.dispatch({
      questionId,
      newValue,
      category
    });
  }

  multiSelectOptionDeleted(category, questionId, optionId) {
    this.dispatch({
      questionId,
      optionId,
      category
    });
  }

  requiredNumSelectionsChanged(category, questionId, newValue) {
    this.dispatch({
      questionId,
      newValue,
      category
    });
  }

  relationshipPeopleChanged(newPeople) {
    this.dispatch(newPeople);
  }

  relationshipPeopleEnabled(newValue) {
    this.dispatch(newValue);
  }

  enabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  typeEnabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  amountEnabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  typeOptionsChanged(typeCd, newList) {
    this.dispatch({typeCd, newList});
  }

  amountOptionsChanged(typeCd, newList) {
    this.dispatch({typeCd, newList});
  }

  destinationEnabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  dateEnabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  reasonEnabledChanged(typeCd, newValue) {
    this.dispatch({typeCd, newValue});
  }

  setCertificationText(newText) { this.dispatch(newText); }

  setCertificationRequired(newValue) { this.dispatch(newValue); }

  setInstructions(step, newValue) {
    this.dispatch({step, newValue});
  }

  toggleInstructionsExpanded() { this.dispatch(); }

  loadConfig(id) { this.dispatch(id); }

  saveAll() { this.dispatch(); }

  undoAll() { this.dispatch(); }
}

export default alt.createActions(_ConfigActions);
