import * as QuestionnaireDB from '../db/QuestionnaireDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/questionnaires/latest', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    QuestionnaireDB.getLatestQuestionnaire(req.dbInfo, userInfo.id, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });

  app.get('/api/coi/questionnaires/screening/latest', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    QuestionnaireDB.getLatestQuestionnaire(req.dbInfo, userInfo.id, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });

  app.get('/api/coi/questionnaires/entities/latest', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    QuestionnaireDB.getLatestQuestionnaire(req.dbInfo, userInfo.id, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });

  app.get('/api/coi/questionnaires/:id', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    QuestionnaireDB.getExistingQuestionnaire(req.dbInfo, userInfo.id, req.params.id, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });
};
