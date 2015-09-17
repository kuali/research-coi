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

  app.get('/api/coi/disclosures/annual', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getAnnualDisclosure(req.dbInfo, userInfo.id, function(err, disclosure) {
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

  // Admin stuff
  app.get('/api/coi/disclosure-summaries', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    let sortColumn = 'DATE_SUBMITTED';
    if (req.query.sortColumn) {
      sortColumn = req.query.sortColumn;
    }
    let sortDirection = 'ASCENDING';
    if (req.query.sortDirection) {
      sortDirection = req.query.sortDirection;
    }

    let filters = {};
    if (req.query.filters) {
      try {
        let potentialFilter = decodeURIComponent(req.query.filters);
        potentialFilter = JSON.parse(potentialFilter);
        filters = potentialFilter;
      }
      catch (parseErr) {
        console.log('invalid filters supplied to disclosure-summaries');
      }
    }
    DisclosureDB.getSummariesForReview(req.dbInfo, userInfo.id, sortColumn, sortDirection, filters, (err, sumarries) => {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(sumarries);
      }
    });
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
};
