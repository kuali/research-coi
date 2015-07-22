import * as DisclosureDB from '../db/DisclosureDB';

export let init = app => {
  app.get('/api/research/coi/disclosures/archived', function(req, res, next) {
    let userId = 0; // Use real user id once we have it
    DisclosureDB.getArchivedDisclosures(req.dbInfo, userId, function(err, disclosures) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(disclosures);
      }
    });
  });

  app.get('/api/research/coi/disclosure-summaries', function(req, res, next) {
    let sortColumn = 'DATE_SUBMITTED';
    if (req.query.sortColumn) {
      sortColumn = req.query.sortColumn;
    }
    let sortDirection = 'ASCENDING';
    if (req.query.sortDirection) {
      sortDirection = req.query.sortDirection;
    }
    let query = '';
    if (req.query.query) {
      query = req.query.query;
    }
    res.send(DisclosureDB.getSummariesForReview(req.dbInfo, sortColumn, sortDirection, query));
  });

  app.get('/api/research/coi/disclosure-user-summaries', function(req, res, next) {
    let userId = 0; // Use real user id once we have it
    DisclosureDB.getSummariesForUser(req.dbInfo, userId, function(err, disclosures) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(disclosures);
      }
    });  
  });

  app.get('/api/research/coi/disclosure/{query}', function(req, res, next){
    res.send(DisclosureDB.search(req.school, req.params.query));
  });

  app.get('/api/research/coi/disclosure/:id', function(req, res, next){
    res.send(DisclosureDB.get(req.school, req.params.id));
  });

  app.put('/api/research/coi/disclosure/:id', function(req, res, next){
    res.sendStatus(202);
    res.send(DisclosureDB.saveExisting(req.school, req.params.id, req.body));
   
  });

  app.post('/api/research/coi/disclosure', function(req, res, next){
    res.sendStatus(202);
    res.send(DisclosureDB.save(req.school, req.body));
  });

  app.post('/api/research/coi/disclosure/:id/approve', function(req, res, next){
    res.sendStatus(202);
    res.send(DisclosureDB.approve(req.school, req.params.id));
  });

  app.post('/api/research/coi/disclosure/:id/sendback', function(req, res, next){
    res.sendStatus(202);
    res.send(DisclosureDB.sendBack(req.school, req.params.id));
  });

  app.post('/api/research/coi/disclosure/:id/reviewer', function(req, res, next){
    if (req.body && req.body.name) {
      res.sendStatus(202);
      res.send(DisclosureDB.addReviewer(req.school, req.params.id, req.body.name));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/questionnaire', function(req, res, next){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addQuestionnaireComment(req.school, req.params.id, req.body.comment));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/entities', function(req, res, next){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addEntityComment(req.school, req.params.id, req.body.comment));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/declarations', function(req, res, next){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addDeclarationComment(req.school, req.params.id, req.body.comment));
    }
  });
};