import * as Config from '../db/config';

export let init = app => {
  app.get('/api/research/coi/config/', function*(next){
    this.body = Config.getConfigFor(this.request.school);
  });
  app.put('/api/research/coi/config/', function*(next){
    // validation?
    Config.setConfigFor(this.request.school, this.request.body);
    this.status = 202;
  });
};