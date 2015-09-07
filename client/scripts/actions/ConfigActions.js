import alt from '../alt';

class _ConfigActions {
  startEditingDeclarationType(id) { this.dispatch(id); }

  updateDeclarationType(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
  }

  loadLatestQuestionnaire() { this.dispatch(); }

  stopEditingDeclarationType(id) { this.dispatch(id); }

  toggleDeclarationType(id) { this.dispatch(id); }

  startEnteringNewDeclarationType() { this.dispatch(); }

  deleteInProgressCustomDeclarationType() { this.dispatch(); }

  saveNewDeclarationType() { this.dispatch(); }

  setNewDeclarationTypeText(newValue) { this.dispatch(newValue); }

  deleteDeclarationType(id) { this.dispatch(id); }

  startEditingDisclosureType(id) { this.dispatch(id); }

  updateDisclosureType(id, newValue) {
    this.dispatch({
      id: id,
      newValue: newValue
    });
  }

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

  validationAddedToQuestion(questionId, validation) {
    this.dispatch({
      questionId: questionId,
      validation: validation
    });
  }

  validationRemovedFromQuestion(questionId, validationId) {
    this.dispatch({
      questionId: questionId,
      validationId: validationId
    });
  }

  questionTypeChosen(questionId, type) {
    this.dispatch({
      questionId: questionId,
      type: type
    });
  }

  questionTextChanged(questionId, text) {
    this.dispatch({
      questionId: questionId,
      text: text
    });
  }

  updateQuestions(questions) { this.dispatch(questions); }

  cancelNewQuestion() { this.dispatch({}); }

  saveNewQuestion() { this.dispatch({}); }

  startNewQuestion() { this.dispatch({}); }

  deleteQuestion(questionId) { this.dispatch(questionId); }

  saveQuestionEdit(questionId) { this.dispatch(questionId); }

  startEditingQuestion(questionId) { this.dispatch(questionId); }

  cancelQuestionEdit(questionId) { this.dispatch(questionId); }

  criteriaChanged(questionId, newValue) {
    this.dispatch({
      questionId: questionId,
      newValue: newValue
    });
  }  
}

export default alt.createActions(_ConfigActions);
