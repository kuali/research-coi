import alt from '../alt';

class _DisclosureActions {
  changeArchiveFilter(newValue) {this.dispatch(newValue);}

  loadArchivedDisclosures() {this.dispatch();}

  toggleInstructions() {this.dispatch();}

  answerQuestion(question) {this.dispatch(question);}

  advanceQuestion() {this.dispatch();}

  previousQuestion() {this.dispatch();}

  setCurrentQuestion(newQuestionId) {this.dispatch(newQuestionId);}

  nextStep() {this.dispatch();}

  newEntityInitiated() {this.dispatch();}

  setInProgressEntityName(newNameValue) {this.dispatch(newNameValue);}

  entityFormNextClicked(entityId) {this.dispatch(entityId);}

  setEntityStatus(newStatus, id) {
    this.dispatch({
      id: id,
      status: newStatus
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

  addEntityRelationship(person, relation, type, amount, comment, entityId) {
    this.dispatch({
      person: person,
      relation: relation,
      type: type,
      amount: amount,
      comment: comment,
      id: entityId
    });
  }

  removeEntityRelationship(relationId, entityId) {
    this.dispatch({
      relationId: relationId,
      entityId: entityId
    });
  }

  entityFormClosed(entityId) {this.dispatch(entityId);}

  saveInProgressEntity(entity) {this.dispatch(entity);}

  changeActiveEntityView(newView) {this.dispatch(newView);}

  updateEntityFormOpened(id) {this.dispatch(id);}

  editEntity(id) {this.dispatch(id);}

  undoEntityChanges(snapshot) {this.dispatch(snapshot);}

  toggleDeclaration(id, type) {
    this.dispatch({
      entityId: id,
      type: type
    });
  }

  changeDeclarationView(newView) {this.dispatch(newView);}

  entityRelationChosen(relationType, entityId, projectId, relation) {
    this.dispatch({
      relationType: relationType,
      entityId: entityId,
      projectId: projectId,
      relation: relation
    });
  }

  declarationCommentedOn(relationType, entityId, projectId, comment) {
    this.dispatch({
      relationType: relationType,
      entityId: entityId,
      projectId: projectId,
      comment: comment
    });
  }

  setAllForEntity(entityId, newValue) {
    this.dispatch({
      entityId: entityId,
      newValue: newValue
    });
  }

  setAllForProject(projectId, newValue) {
    this.dispatch({
      projectId: projectId,
      newValue: newValue
    });
  }

  resetDisclosure() { this.dispatch(); }

  toggleConfirmationMessage() {this.dispatch();}
}

export let DisclosureActions = alt.createActions(_DisclosureActions);