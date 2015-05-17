import * as Disclosure from '../db/disclosure';

let getSchool = () => {
  // This should look at the request and figure out what school is being used.
  return 'UIT'; // Stub
};

export let init = app => {
  app.get('/api/research/coi/disclosure/{query}', function*(next){
    this.body = Disclosure.search(getSchool, this.params.query);
  });
  app.get('/api/research/coi/disclosure/:id', function*(next){
    this.body = Disclosure.get(getSchool(), this.params.id);
  });
  app.put('/api/research/coi/disclosure/:id', function*(next){
    Disclosure.saveExisting(getSchool(), this.params.id, this.request.body);
    this.status = 202;
  });
  app.post('/api/research/coi/disclosure', function*(next){
    let assignedId = Disclosure.save(getSchool(), this.request.body);
    this.body = assignedId;
    this.status = 202;
  });
  app.post('/api/research/coi/disclosure/:id/approve', function*(next){
    Disclosure.approve(getSchool(), this.params.id);
    this.status = 202;
  });
  app.post('/api/research/coi/disclosure/:id/sendback', function*(next){
    Disclosure.sendBack(getSchool(), this.params.id);
    this.status = 202;
  });
  app.post('/api/research/coi/disclosure/:id/reviewer', function*(next){
    if (this.request.body && this.request.body.name) {
      Disclosure.addReviewer(getSchool(), this.params.id, this.request.body.name);
      this.status = 202;      
    }
  });
  app.post('/api/research/coi/disclosure/:id/comment/questionnaire', function*(next){
    if (this.request.body && this.request.body.comment) {
      Disclosure.addQuestionnaireComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });
  app.post('/api/research/coi/disclosure/:id/comment/entities', function*(next){
    if (this.request.body && this.request.body.comment) {
      Disclosure.addEntityComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });
  app.post('/api/research/coi/disclosure/:id/comment/declarations', function*(next){
    if (this.request.body && this.request.body.comment) {
      Disclosure.addDeclarationComment(getSchool(), this.params.id, this.request.body.comment);
      this.status = 202;
    }
  });
};