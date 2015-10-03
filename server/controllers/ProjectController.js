import * as ProjectDB from '../db/ProjectDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/projects', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    ProjectDB.getProjects(req.dbInfo, userInfo.id)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/projects', function(req, res, next) {
    // TODO: api key needed
    ProjectDB.saveProjects(req.dbInfo, req.body)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
