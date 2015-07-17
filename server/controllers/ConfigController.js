import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/research/coi/config/', function(req, res, next){
    res.send(ConfigDB.getConfigFor(req.school));
  });
  app.put('/api/research/coi/config/', function(req, res, next){
    // validation?
    res.sendStatus(202);
    res.send(ConfigDB.setConfigFor(req.school, req.body));
  });
};