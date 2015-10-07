import * as DisclosureDB from '../db/DisclosureDB';
import * as PIReviewDB from '../db/PIReviewDB';
import {getUserInfo} from '../AuthService';
import multer from 'multer';

let upload;
try {
  let extensions = require('research-extensions');
  upload = extensions.storage;
}
catch (err) {
  upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
}

export let init = app => {
  app.get('/api/coi/disclosures/archived', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getArchivedDisclosures(req.dbInfo, userInfo.id)
      .then(disclosures => {
        res.send(disclosures);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.get('/api/coi/disclosure-user-summaries', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getSummariesForUser(req.dbInfo, userInfo.id)
      .then(disclosures => {
        res.send(disclosures);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.get('/api/coi/disclosures/annual', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.getAnnualDisclosure(req.dbInfo, userInfo.id, userInfo.displayName)
      .then(disclosure => {
        res.send(disclosure);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.get('/api/coi/disclosures/:id', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.get(req.dbInfo, userInfo.id, req.params.id)
      .then(disclosure => {
        res.send(disclosure);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

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
    DisclosureDB.getSummariesForReview(req.dbInfo, userInfo.id, sortColumn, sortDirection, start, filters)
      .then(summaries => {
        res.send(summaries);
      })
      .catch(err => {
        console.error(err);
        next(err);
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

    DisclosureDB.getSummariesForReviewCount(req.dbInfo, userInfo.id, filters)
      .then(count => {
        res.send(count);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/disclosure/:id/financial-entity', upload.array('attachments'), function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveExistingFinancialEntity(req.dbInfo, userInfo.displayName, req.params.id, JSON.parse(req.body.entity), req.files)
      .then(financialEntity => {
        res.send(financialEntity);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.put('/api/coi/disclosure/:id/financial-entity', upload.array('attachments'), function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveNewFinancialEntity(req.dbInfo, userInfo.displayName, req.params.id, JSON.parse(req.body.entity), req.files)
      .then(financialEntity => {
        res.send(financialEntity);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.put('/api/coi/disclosure/:id/declaration', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
    DisclosureDB.saveDeclaration(req.dbInfo, userInfo.id, req.body)
      .then(declaration => {
        res.send(declaration);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/disclosure/:id/declaration', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
    DisclosureDB.saveExistingDeclaration(req.dbInfo, userInfo.id, req.body)
      .then(declaration => {
        res.send(declaration);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/disclosure/:id/question/answer', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveNewQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body)
      .then(answer => {
        res.send(answer);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.put('/api/coi/disclosure/:id/question/answer', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.saveExistingQuestionAnswer(req.dbInfo, userInfo.id, req.params.id, req.body)
      .then(answer => {
        res.send(answer);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/disclosure/:id/submit', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    DisclosureDB.submit(req.dbInfo, userInfo.displayName, req.params.id)
      .then(() => {
        res.sendStatus(202);
      })
      .catch(err => {
        console.error(err);
        next(err);
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
        })
        .then(result => {
          res.send(result[0]);
        })
        .catch(err => {
          console.error(err);
          next(err);
        });
    }
  });

  app.get('/api/coi/disclosure/:id/pi-review-items', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken);

    PIReviewDB.getPIReviewItems(req.dbInfo, userInfo, req.params.id)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
