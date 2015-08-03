import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/coi/config/', function(req, res){
    res.send(ConfigDB.getConfig(req));
  });
  app.put('/api/coi/config/', function(req, res){
    // validation?
    res.sendStatus(202);
    res.send(ConfigDB.setConfig(req));
  });
};
