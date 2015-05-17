import * as Config from '../db/config';

let getSchool = () => {
  // This should look at the request and figure out what school is being used.
  return 'MIT'; // Stub
};

export let init = app => {
  app.get('/api/research/coi/config/', function*(next){
    let school = getSchool();
    this.body = Config.getConfigFor(school);
  });
  app.put('/api/research/coi/config/', function*(next){
    // validation?
    let school = getSchool();
    Config.setConfigFor(school, this.request.body);
    this.status = 202;
  });
};