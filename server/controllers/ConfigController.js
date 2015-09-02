import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/coi/config', function(req, res, next) {
    ConfigDB.getConfig(req.dbInfo, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });

  app.put('/api/coi/config/', function(req, res){
    // validation?
    res.sendStatus(202);
    res.send(ConfigDB.setConfig(req));
  });
};
