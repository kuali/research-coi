import * as DisclosureDB from '../db/DisclosureDB';
import {getUserInfo} from '../AuthService';

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
  app.get('/api/coi/disclosures/archived', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getArchivedDisclosures(req.dbInfo, userInfo.id, function(err, disclosures) {
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
  app.get('/api/coi/disclosure-user-summaries', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getSummariesForUser(req.dbInfo, userInfo.id, function(err, disclosures) {
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
  app.get('/api/coi/disclosure/{query}', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    res.send(DisclosureDB.search(req.dbInfo, userInfo.id, req.params.query));
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

  app.get('/api/coi/disclosures/min', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getMinDisclosure(req.dbInfo, userInfo.id, function(err, disclosure) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(disclosure);
      }
    });
  });

  app.get('/api/coi/disclosures/:id', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.get(req.dbInfo, userInfo.id, req.params.id, function(err, disclosure) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(disclosure);
      }
    });
  });

  app.get('/api/coi/disclosure/financial-entity/types', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getEntityTypes(req.dbInfo, userInfo.id, function(err, entityTypes) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(entityTypes);
      }
    });
  });

  app.get('/api/coi/disclosure/financial-entity/relationship/category-types', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getRelationshipCategoryTypes(req.dbInfo, userInfo.id, function(err, relationshipCategories) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(relationshipCategories);
      }
    });
  });

  app.get('/api/coi/disclosure/financial-entity/relationship/types', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getRelationshipTypes(req.dbInfo, userInfo.id, function(err, relationshipTypes) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(relationshipTypes);
      }
    });
  });

  app.get('/api/coi/disclosure/financial-entity/relationship/person-types', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getRelationshipPersonTypes(req.dbInfo, userInfo.id, function(err, personTypes) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(personTypes);
      }
    });
  });

  app.get('/api/coi/disclosure/financial-entity/relationship/amount-types', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getRelationshipAmountTypes(req.dbInfo, userInfo.id, function(err, amountTypes) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(amountTypes);
      }
    });
  });

  app.get('/api/coi/disclosure/declaration/relationship/statuses', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getRelationshipStatuses(req.dbInfo, userInfo.id, function(err, statuses) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(statuses);
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
  app.put('/api/coi/disclosure/:id', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.saveExisting(req.dbInfo, userInfo.id, req.params.id, req.body));
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
  app.post('/api/coi/disclosure', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.save(req.dbInfo, userInfo.id, req.body));
  });

  // Admin stuff
  app.get('/api/coi/disclosure-summaries', function(req, res) {
    let userInfo = getUserInfo(req.cookies.authToken);
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
    res.send(DisclosureDB.getSummariesForReview(req.dbInfo, userInfo.id, sortColumn, sortDirection, query));
  });


  app.post('/api/coi/disclosure/:id/financial-entity', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveExistingFinancialEntity(req.dbInfo, userInfo.id, req.params.id, req.body, function(err, financialEntity) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(financialEntity);
      }
    });
  });

  app.put('/api/coi/disclosure/:id/financial-entity', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveNewFinancialEntity(req.dbInfo, userInfo.id, req.params.id, req.body, function(err, financialEntity) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(financialEntity);
      }
    });
  });

  app.put('/api/coi/disclosure/:id/declaration', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveDeclaration(req.dbInfo, userInfo.id, req.body, function(err, declaration){
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(declaration);
      }
    }, undefined);
  });

  app.post('/api/coi/disclosure/:id/declaration', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveExistingDeclaration(req.dbInfo, userInfo.id, req.body, function(err, declaration){
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(declaration);
      }
    }, undefined);
  });

  app.post('/api/coi/disclosure/:id/question/answer', function(req, res) {
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.saveExistingQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body));
  });

  app.put('/api/coi/disclosure/:id/question/answer', function(req, res) {
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.saveNewQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body));
  });

  app.post('/api/coi/disclosure/:id/approve', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.approve(req.dbInfo, userInfo.id, req.params.id));
  });

  app.post('/api/coi/disclosure/:id/sendback', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    res.sendStatus(202);
    res.send(DisclosureDB.sendBack(req.dbInfo, userInfo.id, req.params.id));
  });

  app.post('/api/coi/disclosure/:id/reviewer', function(req, res){
    if (req.body && req.body.name) {
      let userInfo = getUserInfo(req.cookies.authToken);
      res.sendStatus(202);
      res.send(DisclosureDB.addReviewer(req.dbInfo, userInfo.id, req.params.id, req.body.name));
    }
  });

  app.post('/api/coi/disclosure/:id/comment/questionnaire', function(req, res){
    if (req.body && req.body.comment) {
      let userInfo = getUserInfo(req.cookies.authToken);
      res.sendStatus(202);
      res.send(DisclosureDB.addQuestionnaireComment(req.dbInfo, userInfo.id, req.params.id, req.body.comment));
    }
  });

  app.post('/api/coi/disclosure/:id/comment/entities', function(req, res){
    if (req.body && req.body.comment) {
      let userInfo = getUserInfo(req.cookies.authToken);
      res.sendStatus(202);
      res.send(DisclosureDB.addEntityComment(req.dbInfo, userInfo.id, req.params.id, req.body.comment));
    }
  });

  app.post('/api/coi/disclosure/:id/comment/declarations', function(req, res){
    if (req.body && req.body.comment) {
      let userInfo = getUserInfo(req.cookies.authToken);
      res.sendStatus(202);
      res.send(DisclosureDB.addDeclarationComment(req.dbInfo, userInfo.id, req.params.id, req.body.comment));
    }
  });
};
