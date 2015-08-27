import * as QuestionnaireDB from '../db/QuestionnaireDB';

export let init = app => {

  app.get('/api/coi/questionnaires/latest', function(req, res, next) {
    QuestionnaireDB.getLatestQuestionnaire(req.dbInfo, function(err, questionnaire) {
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
    QuestionnaireDB.getExistingQuestionnaire(req.dbInfo, req.params.id, function(err, questionnaire) {
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
