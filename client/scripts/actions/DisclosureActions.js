import alt from '../alt';

class _DisclosureActions {
  changeArchiveFilter(newValue) { this.dispatch(newValue); }

  loadArchivedDisclosures() { this.dispatch(); }

  changeArchivedQuery(newQuery) { this.dispatch(newQuery); }

  loadDisclosureSummaries() { this.dispatch(); }

  loadDisclosureData(disclosureType) {this.dispatch(disclosureType); }

  toggleInstructions() { this.dispatch(); }

  answerQuestion(question) { this.dispatch(question); }

  advanceQuestion() { this.dispatch(); }

  previousQuestion() { this.dispatch(); }

  setCurrentQuestion(newQuestionId) { this.dispatch(newQuestionId); }

  nextStep() { this.dispatch(); }

  newEntityInitiated() { this.dispatch(); }

  setInProgressEntityName(newNameValue) { this.dispatch(newNameValue); }

  entityFormNextClicked(entityId) { this.dispatch(entityId); }

  entityFormBackClicked(entityId) { this.dispatch(entityId); }

  setEntityActiveStatus(active, id) {
    this.dispatch({
      id: id,
      active: active
    });
  }

  setEntityType(newValue, id) {
    this.dispatch({
      id: id,
      type: newValue
    });
  }

  setEntityPublic(newValue, id) {
    this.dispatch({
      id: id,
      isPublic: newValue
    });
  }

  setEntityIsSponsor(newValue, id) {
    this.dispatch({
      id: id,
      isSponsor: newValue
    });
  }

  setEntityDescription(newValue, id) {
    this.dispatch({
      id: id,
      description: newValue
    });
  }

  setEntityRelationshipPerson(person) { this.dispatch(person); }

  setEntityRelationshipRelation(relation) { this.dispatch(relation); }

  setEntityRelationshipType(type) { this.dispatch(type); }

  setEntityRelationshipAmount(amount) { this.dispatch(amount); }

  setEntityRelationshipComment(comment) { this.dispatch(comment); }

  addEntityRelationship(entityId) {
    this.dispatch(entityId);
  }

  removeEntityRelationship(relationId, entityId) {
    this.dispatch({
      relationId: relationId,
      entityId: entityId
    });
  }

  entityFormClosed(entity) { this.dispatch(entity); }

  saveInProgressEntity(entity) { this.dispatch(entity); }

  changeActiveEntityView(newView) { this.dispatch(newView); }

  updateEntityFormOpened(id) { this.dispatch(id); }

  editEntity(id) { this.dispatch(id); }

  undoEntityChanges(snapshot) { this.dispatch(snapshot); }

  toggleDeclaration(id, type) {
    this.dispatch({
      entityId: id,
      type: type
    });
  }

  changeDeclarationView(newView) { this.dispatch(newView); }

  entityRelationChosen(relationType, finEntityId, projectId, relationshipStatusCd) {
    this.dispatch({
      relationType: relationType,
      finEntityId: finEntityId,
      projectId: projectId,
      relationshipStatusCd: relationshipStatusCd
    });
  }

  declarationCommentedOn(relationType, finEntityId, projectId, comments) {
    this.dispatch({
      relationType: relationType,
      finEntityId: finEntityId,
      projectId: projectId,
      comments: comments
    });
  }

  setAllForEntity(finEntityId, newValue) {
    this.dispatch({
      finEntityId: finEntityId,
      newValue: newValue
    });
  }

  setAllForProject(type, projectId, newValue) {
    this.dispatch({
      type: type,
      projectId: projectId,
      newValue: newValue
    });
  }

  resetDisclosure() { this.dispatch(); }

  toggleConfirmationMessage() { this.dispatch(); }

  manualTypeSelected(disclosureId, manualType) {
    this.dispatch({
      disclosureId: disclosureId,
      manualType: manualType
    });
  }

  saveManualEvent(disclosureId, id, title, sponsor, role, amount, projectType, startDate, endDate) {
    this.dispatch({
      disclosureId: disclosureId,
      id: id,
      title: title,
      sponsor: sponsor,
      role: role,
      amount: amount,
      projectType: projectType,
      startDate: startDate,
      endDate: endDate
    });
  }

  doneEditingManualEvent(disclosureId) { this.dispatch(disclosureId); }

  jumpToStep(step) {
    this.dispatch(step);
  }

  setArchiveSort(field, direction) {
    this.dispatch({
      field: field,
      direction: direction
    });
  }

  loadArchivedDisclosureDetail(id) { this.dispatch(id); }

  turnOnValidation(step) { this.dispatch(step); }

  turnOffValidation(step) { this.dispatch(step); }
}

export let DisclosureActions = alt.createActions(_DisclosureActions);
