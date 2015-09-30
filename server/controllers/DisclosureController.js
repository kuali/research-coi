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
    DisclosureDB.getAnnualDisclosure(req.dbInfo, userInfo.id, userInfo.displayName, function(err, disclosure) {
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

    let start = 0;
    if (req.query.start && !isNaN(req.query.start)) {
      start = req.query.start;
    }
    DisclosureDB.getSummariesForReview(req.dbInfo, userInfo.id, sortColumn, sortDirection, start, filters, (err, summaries) => {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(summaries);
      }
    });
  });

  app.get('/api/coi/disclosure-summaries/count', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);

    let filters = {};
    if (req.query.filters) {
      try {
        let potentialFilter = decodeURIComponent(req.query.filters);
        potentialFilter = JSON.parse(potentialFilter);
        filters = potentialFilter;
      }
      catch (parseErr) {
        console.log('invalid filters supplied to disclosure-summaries/count');
      }
    }

    DisclosureDB.getSummariesForReviewCount(req.dbInfo, userInfo.id, filters, (err, count) => {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(count);
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
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
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
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
    DisclosureDB.saveExistingDeclaration(req.dbInfo, userInfo.id, req.body, function(err, declaration){
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(declaration);
      }
    }, undefined);
  });

  app.post('/api/coi/disclosure/:id/question/answer', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveExistingQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body, function(err, answer) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(answer);
      }
    });
  });

  app.put('/api/coi/disclosure/:id/question/answer', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveNewQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body, function(err, answer) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.send(answer);
      }
    });
  });

  app.post('/api/coi/disclosure/:id/submit', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.submit(req.dbInfo, userInfo.displayName, req.params.id, function(err) {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.sendStatus(202);
      }
    });
  });

  app.post('/api/coi/disclosure/:id/comment', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken);
    let comment = req.body;

    if (!comment.topicSection ||
        !comment.topicId ||
        comment.visibleToPI === undefined ||
        comment.visibleToReviewers === undefined ||
        !comment.text ||
        isNaN(req.params.id)
       ) {
      next(new Error('invalid comment body'));
    }
    else {
      DisclosureDB.addComment(req.dbInfo, userInfo, {
        topicSection: comment.topicSection,
        topicId: comment.topicId,
        visibleToPI: comment.visibleToPI,
        visibleToReviewers: comment.visibleToReviewers,
        text: comment.text,
        disclosureId: req.params.id
      }, (err, updatedComments) => {
        if (err) {
          console.error(err);
          next(err);
        } else {
          res.send(updatedComments);
        }
      });
    }
  });
};
