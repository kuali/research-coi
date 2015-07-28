import * as DisclosureDB from '../db/DisclosureDB';

export let init = app => {
  // Returns summaries of all archived disclosures for the user
  /*
    [
      {
        id,
        type,
        title,
        date_submitted,
        date_approved,
        project_start_date,
        project_type
      }
    ]
  */
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

  // Returns summaries of all non-archived disclosures for the current user
  /*
    [
      {
        id,
        type,
        title,
        expiration_date,
        status,
        last_review_date
      }
    ]
  */
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

  // I'm not sure we need this route anymore...
  app.get('/api/research/coi/disclosure/{query}', function(req, res){
    res.send(DisclosureDB.search(req.dbInfo, req.params.query));
  });

  // Returns details of a disclosure
  /*
    {
      id,
      type,
      version,
      date_submitted,
      date_approved,
      questionnaire: {
        question_number: answer
      },
      entities: [
        {
          entity_id,
          name,
          is_active,
          is_public,
          type,
          is_sponsor,
          description,
          relationships: [
            id,
            person,
            type,
            relationship_category,
            amount,
            comment
          ]
        }
      ],
      declarations: [
        {
          project_id,
          project_name,
          entities_id,
          entity_name,
          disposition,
          comments
        }
      ]
    }
  */
  app.get('/api/research/coi/disclosures/:id', function(req, res, next){
    // Use real user id once we have it
    DisclosureDB.get(req.dbInfo, req.params.id, function(err, disclosure) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(disclosure);
      }
    });
  });

  // Save existing disclosure with this data
  /*
    {
      id,
      type,
      version,
      date_submitted,
      date_approved,
      questionnaire: {
        question_number: answer
      },
      entities: [
        {
          entity_id,
          name,
          is_active,
          is_public,
          type,
          is_sponsor,
          description,
          relationships: [
            id,
            person,
            type,
            relationship_category,
            amount,
            comment
          ]
        }
      ],
      declarations: [
        {
          project_id,
          project_name,
          entities_id,
          entity_name,
          disposition,
          comments
        }
      ]
    }
  */
  app.put('/api/research/coi/disclosure/:id', function(req, res){
    res.sendStatus(202);
    res.send(DisclosureDB.saveExisting(req.dbInfo, req.params.id, req.body));
  });

  // Save new disclosure with this data
  /*
    {
      id,
      type,
      version,
      date_submitted,
      date_approved,
      questionnaire: {
        question_number: answer
      },
      entities: [
        {
          entity_id,
          name,
          is_active,
          is_public,
          type,
          is_sponsor,
          description,
          relationships: [
            id,
            person,
            type,
            relationship_category,
            amount,
            comment
          ]
        }
      ],
      declarations: [
        {
          project_id,
          project_name,
          entities_id,
          entity_name,
          disposition,
          comments
        }
      ]
    }
  */
  app.post('/api/research/coi/disclosure', function(req, res){
    res.sendStatus(202);
    res.send(DisclosureDB.save(req.dbInfo, req.body));
  });

  // Admin stuff
  app.get('/api/research/coi/disclosure-summaries', function(req, res) {
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

  app.post('/api/research/coi/disclosure/:id/approve', function(req, res){
    res.sendStatus(202);
    res.send(DisclosureDB.approve(req.dbInfo, req.params.id));
  });

  app.post('/api/research/coi/disclosure/:id/sendback', function(req, res){
    res.sendStatus(202);
    res.send(DisclosureDB.sendBack(req.dbInfo, req.params.id));
  });

  app.post('/api/research/coi/disclosure/:id/reviewer', function(req, res){
    if (req.body && req.body.name) {
      res.sendStatus(202);
      res.send(DisclosureDB.addReviewer(req.dbInfo, req.params.id, req.body.name));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/questionnaire', function(req, res){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addQuestionnaireComment(req.dbInfo, req.params.id, req.body.comment));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/entities', function(req, res){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addEntityComment(req.dbInfo, req.params.id, req.body.comment));
    }
  });

  app.post('/api/research/coi/disclosure/:id/comment/declarations', function(req, res){
    if (req.body && req.body.comment) {
      res.sendStatus(202);
      res.send(DisclosureDB.addDeclarationComment(req.dbInfo, req.params.id, req.body.comment));
    }
  });
};
