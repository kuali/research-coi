import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/research/coi/config/', function(req, res, next){
    res.send(ConfigDB.getConfig(req));
  });
  app.put('/api/research/coi/config/', function(req, res, next){
    // validation?
    res.sendStatus(202);
    res.send(ConfigDB.setConfig(req));
  });
};