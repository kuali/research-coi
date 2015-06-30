import * as DisclosureDB from '../db/DisclosureDB';

let getSchool = () => {
  // This should look at the request and figure out what school is being used.
  return 'UIT'; // Stub
};

export let init = app => {
  app.get('/api/research/coi/disclosures/archived', function*(next) {
    let userId = 0; // Use real user id once we have it
    this.body = DisclosureDB.getArchivedDisclosures(getSchool(), userId);
  });

  app.get('/api/research/coi/disclosures', function*(next) {
    let sortColumn = 'DATE_SUBMITTED';
    if (this.request.query.sortColumn) {
      sortColumn = this.request.query.sortColumn;
    }
    let sortDirection = 'ASCENDING';
    if (this.request.query.sortDirection) {
      sortDirection = this.request.query.sortDirection;
    }
    let query = '';
    if (this.request.query.query) {
      query = this.request.query.query;
    }
    this.body = DisclosureDB.getReadyForReview(getSchool(), sortColumn, sortDirection, query);
  });

  app.get('/api/research/coi/disclosure/{query}', function*(next){
    this.body = DisclosureDB.search(getSchool(), this.params.query);
  });

  app.get('/api/research/coi/disclosure/:id', function*(next){
    this.body = DisclosureDB.get(getSchool(), this.params.id);
  });

  app.put('/api/research/coi/disclosure/:id', function*(next){
    DisclosureDB.saveExisting(getSchool(), this.params.id, this.request.body);
    this.status = 202;
  });

  app.post('/api/research/coi/disclosure', function*(next){
    let assignedId = DisclosureDB.save(getSchool(), this.request.body);
    this.body = assignedId;
    this.status = 202;
  });

  app.post('/api/research/coi/disclosure/:id/approve', function*(next){
    DisclosureDB.approve(getSchool(), this.params.id);
    this.status = 202;
  });

  app.post('/api/research/coi/disclosure/:id/sendback', function*(next){
    DisclosureDB.sendBack(getSchool(), this.params.id);
    this.status = 202;
  });

  app.post('/api/research/coi/disclosure/:id/reviewer', function*(next){
    if (this.request.body && this.request.body.name) {
      DisclosureDB.addReviewer(getSchool(), this.params.id, this.request.body.name);
      this.status = 202;      
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/questionnaire', function*(next){
    if (this.request.body && this.request.body.comment) {
      DisclosureDB.addQuestionnaireComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/entities', function*(next){
    if (this.request.body && this.request.body.comment) {
      DisclosureDB.addEntityComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/declarations', function*(next){
    if (this.request.body && this.request.body.comment) {
      DisclosureDB.addDeclarationComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });
};