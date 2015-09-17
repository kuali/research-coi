import alt from '../alt';

class _ConfigActions {
  startEditingDeclarationType(id) { this.dispatch(id); }

  updateDeclarationType(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
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
    this.dispatch({
      typeCd: typeCd,
      newValue: newValue
    });
  }

  enableSponsorLookup() { this.dispatch(); }

  disableSponsorLookup() { this.dispatch(); }

  setDueDate(newDate) { this.dispatch(newDate); }

  setIsRollingDueDate(value) { this.dispatch(value); }

  setWarningValueOnNotification(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
  }

  setWarningPeriodOnNotification(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
  }

  setReminderTextOnNotification(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
  }

  saveNewNotification() { this.dispatch(); }

  deleteNotification(id) { this.dispatch(id); }

  questionTypeChosen(category, questionId, type) {
    this.dispatch({
      questionId: questionId,
      type: type,
      category: category
    });
  }

  questionTextChanged(category, questionId, text) {
    this.dispatch({
      questionId: questionId,
      text: text,
      category: category
    });
  }

  updateQuestions(category, questions) {
    this.dispatch({
      questions: questions,
      category: category
    });
  }

  cancelNewQuestion(category) {
    this.dispatch({
      category: category
    });
  }

  saveNewQuestion(category) {
    this.dispatch({
      category: category
    });
  }

  startNewQuestion(category) {
    this.dispatch({
      category: category
    });
  }

  deleteQuestion(category, questionId) {
    this.dispatch({
      questionId: questionId,
      category: category
    });
  }

  saveQuestionEdit(category, questionId) {
    this.dispatch({
      questionId: questionId,
      category: category
    });
  }

  startEditingQuestion(category, questionId) {
    this.dispatch({
      questionId: questionId,
      category: category
    });
  }

  cancelQuestionEdit(category, questionId) {
    this.dispatch({
      questionId: questionId,
      category: category
    });
  }

  criteriaChanged(category, questionId, newValue) {
    this.dispatch({
      questionId: questionId,
      newValue: newValue,
      category: category
    });
  }

  multiSelectOptionAdded(category, questionId, newValue) {
    this.dispatch({
      questionId: questionId,
      newValue: newValue,
      category: category
    });
  }

  multiSelectOptionDeleted(category, questionId, optionId) {
    this.dispatch({
      questionId: questionId,
      optionId: optionId,
      category: category
    });
  }

  requiredNumSelectionsChanged(category, questionId, newValue) {
    this.dispatch({
      questionId: questionId,
      newValue: newValue,
      category: category
    });
  }

  relationshipPeopleChanged(newPeople) {
    this.dispatch(newPeople);
  }

  relationshipPeopleEnabled(newValue) {
    this.dispatch(newValue);
  }

  enabledChanged(typeCd, newValue) {
    this.dispatch({
      typeCd: typeCd,
      newValue: newValue
    });
  }

  typeEnabledChanged(typeCd, newValue) {
    this.dispatch({
      typeCd: typeCd,
      newValue: newValue
    });
  }

  amountEnabledChanged(typeCd, newValue) {
    this.dispatch({
      typeCd: typeCd,
      newValue: newValue
    });
  }

  typeOptionsChanged(typeCd, newList) {
    this.dispatch({
      typeCd: typeCd,
      newList: newList
    });
  }

  amountOptionsChanged(typeCd, newList) {
    this.dispatch({
      typeCd: typeCd,
      newList: newList
    });
  }

  setCertificationText(newText) { this.dispatch(newText); }

  setCertificationRequired(newValue) { this.dispatch(newValue); }

  setInstructions(step, newValue) {
    this.dispatch({
      step: step,
      newValue: newValue
    });
  }

  saveAll() { this.dispatch(); }

  undoAll() { this.dispatch(); }
}

export default alt.createActions(_ConfigActions);
