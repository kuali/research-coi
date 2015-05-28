import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/research/coi/config/', function*(next){
    this.body = ConfigDB.getConfigFor(this.request.school);
  });
  app.put('/api/research/coi/config/', function*(next){
    // validation?
    ConfigDB.setConfigFor(this.request.school, this.request.body);
    this.status = 202;
  });
};